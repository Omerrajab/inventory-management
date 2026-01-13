import { Injectable } from '@nestjs/common';
import { SalesService } from '../sales/sales.service';

import { InventoryService } from '../inventory/inventory.service';
import { format, subDays, startOfDay } from 'date-fns';

@Injectable()
export class AiService {
    constructor(
        private readonly salesService: SalesService,
        private readonly inventoryService: InventoryService,
    ) { }


    async getSalesForecast() {
        const salesResponse = await this.salesService.findAll({ limit: 10000 });
        const sales = salesResponse.data;

        // Group sales by day for the last 30 days
        const dailyData = new Map<string, number>();
        const last30Days = Array.from({ length: 30 }, (_, i) => format(subDays(new Date(), i), 'yyyy-MM-dd')).reverse();

        last30Days.forEach(date => dailyData.set(date, 0));

        sales.forEach((sale: any) => {
            const date = format(new Date(sale.createdAt), 'yyyy-MM-dd');
            if (dailyData.has(date)) {
                dailyData.set(date, dailyData.get(date)! + sale.totalAmount);
            }
        });

        const chartData = last30Days.map(date => ({
            date,
            actual: dailyData.get(date) || 0,
            forecast: 0 // Will compute below
        }));

        // Simple 7-day Moving Average for forecast
        for (let i = 7; i < chartData.length; i++) {
            const last7Days = chartData.slice(i - 7, i);
            const avg = last7Days.reduce((acc, curr) => acc + curr.actual, 0) / 7;
            chartData[i].forecast = Math.round(avg * 100) / 100;
        }

        // Predicted next week
        const last7DaysAvg = chartData.slice(-7).reduce((acc, curr) => acc + curr.actual, 0) / 7;
        const predictedWeekly = last7DaysAvg * 7;

        return {
            timeline: chartData,
            insights: {
                predictedWeeklyDemand: Math.round(predictedWeekly * 100) / 100,
                growthRate: this.calculateGrowth(chartData),
                confidence: sales.length > 10 ? 'Medium' : 'Low'
            }
        };
    }

    private calculateGrowth(data: any[]) {
        if (data.length < 14) return 0;
        const currentWeek = data.slice(-7).reduce((acc, curr) => acc + curr.actual, 0);
        const prevWeek = data.slice(-14, -7).reduce((acc, curr) => acc + curr.actual, 0);
        if (prevWeek === 0) return 0;
        return Math.round(((currentWeek - prevWeek) / prevWeek) * 100);
    }

    async getStockOptimization() {
        const productsResponse = await this.inventoryService.findAll({ limit: 10000 });
        const salesResponse = await this.salesService.findAll({ limit: 10000 });
        const products = productsResponse.data;
        const sales = salesResponse.data;

        const recommendations = products.map((product: any) => {
            // Calculate velocity (units per day) in last 30 days
            const productSales = sales.flatMap((s: any) => s.items)
                .filter((item: any) => item.productId?.toString() === product._id.toString());

            const totalSold = productSales.reduce((acc: number, curr: any) => acc + curr.quantity, 0);
            const dailyVelocity = totalSold / 30;

            // Simple heuristic: Maintain 14 days of supply
            const targetStock = Math.ceil(dailyVelocity * 14);
            const shortfall = Math.max(0, targetStock - product.quantity);

            return {
                productId: product._id,
                name: product.name,
                currentStock: product.quantity,
                dailyVelocity: Math.round(dailyVelocity * 100) / 100,
                recommendedReorder: shortfall > 0 ? shortfall : 0,
                daysRemaining: dailyVelocity > 0 ? Math.floor(product.quantity / dailyVelocity) : 999
            };
        }).filter((r: any) => r.recommendedReorder > 0 || r.daysRemaining < 7);

        return recommendations.sort((a: any, b: any) => a.daysRemaining - b.daysRemaining);
    }
}

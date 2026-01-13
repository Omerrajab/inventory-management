import { Injectable } from '@nestjs/common';
import { SalesService } from '../sales/sales.service';
import { InventoryService } from '../inventory/inventory.service';
import { startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, format } from 'date-fns';

@Injectable()
export class ReportsService {
    constructor(
        private readonly salesService: SalesService,
        private readonly inventoryService: InventoryService,
    ) { }

    async getProfitLossReport(period: 'monthly' | 'quarterly' | 'yearly', date?: string) {
        const salesResponse = await this.salesService.findAll({ limit: 10000 });
        const productsResponse = await this.inventoryService.findAll({ limit: 10000 });
        const sales = salesResponse.data;
        const products = productsResponse.data;
        const productMap = new Map(products.map((p: any) => [(p as any)._id.toString(), p]));

        const targetDate = date ? new Date(date) : new Date();
        let start: Date, end: Date;

        if (period === 'monthly') {
            start = startOfMonth(targetDate);
            end = endOfMonth(targetDate);
        } else if (period === 'quarterly') {
            start = startOfQuarter(targetDate);
            end = endOfQuarter(targetDate);
        } else {
            start = new Date(targetDate.getFullYear(), 0, 1);
            end = new Date(targetDate.getFullYear(), 11, 31, 23, 59, 59);
        }

        const periodSales = sales.filter((sale: any) => {
            const d = new Date(sale.createdAt);
            return d >= start && d <= end;
        });

        let totalRevenue = 0;
        let totalCost = 0;
        let totalTax = 0;

        periodSales.forEach((sale: any) => {
            totalRevenue += sale.totalAmount - sale.taxAmount;
            totalTax += sale.taxAmount;

            sale.items.forEach((item: any) => {
                const product = productMap.get(item.productId.toString());
                if (product) {
                    totalCost += ((product as any).purchasePrice || 0) * item.quantity;
                }
            });
        });

        return {
            period,
            start: format(start, 'yyyy-MM-dd'),
            end: format(end, 'yyyy-MM-dd'),
            revenue: Math.round(totalRevenue * 100) / 100,
            costOfGoodsSold: Math.round(totalCost * 100) / 100,
            grossProfit: Math.round((totalRevenue - totalCost) * 100) / 100,
            taxCollected: Math.round(totalTax * 100) / 100,
            margin: totalRevenue > 0 ? Math.round(((totalRevenue - totalCost) / totalRevenue) * 100) : 0,
            transactionCount: periodSales.length
        };
    }

    async getGstReport(month: number, year: number) {
        const salesResponse = await this.salesService.findAll({ limit: 10000 });
        const sales = salesResponse.data;
        const start = startOfMonth(new Date(year, month - 1));
        const end = endOfMonth(new Date(year, month - 1));

        const monthSales = sales.filter((sale: any) => {
            const d = new Date(sale.createdAt);
            return d >= start && d <= end;
        });

        // B2B (with GSTIN) and B2C (without GSTIN) aggregation
        let b2bCount = 0;
        let b2cCount = 0;
        let totalTaxableValue = 0;
        let totalCgst = 0;
        let totalSgst = 0;
        let totalIgst = 0;

        const details = monthSales.map((sale: any) => {
            const isB2B = !!(sale as any).customerId?.gstin;
            if (isB2B) b2bCount++; else b2cCount++;

            const taxable = sale.totalAmount - sale.taxAmount;
            totalTaxableValue += taxable;
            totalCgst += sale.cgst || 0;
            totalSgst += sale.sgst || 0;
            totalIgst += sale.igst || 0;

            return {
                date: format(new Date(sale.createdAt), 'yyyy-MM-dd'),
                invoiceNumber: sale.invoiceNumber,
                customer: (sale as any).customerId?.name || 'Walk-in',
                gstin: (sale as any).customerId?.gstin || 'URD',
                taxableValue: Math.round(taxable * 100) / 100,
                cgst: Math.round((sale.cgst || 0) * 100) / 100,
                sgst: Math.round((sale.sgst || 0) * 100) / 100,
                igst: Math.round((sale.igst || 0) * 100) / 100,
                total: Math.round(sale.totalAmount * 100) / 100
            };
        });

        return {
            month: format(start, 'MMMM yyyy'),
            summary: {
                b2bCount,
                b2cCount,
                totalTaxableValue: Math.round(totalTaxableValue * 100) / 100,
                totalCgst: Math.round(totalCgst * 100) / 100,
                totalSgst: Math.round(totalSgst * 100) / 100,
                totalIgst: Math.round(totalIgst * 100) / 100,
                totalTax: Math.round((totalCgst + totalSgst + totalIgst) * 100) / 100
            },
            details
        };
    }
}


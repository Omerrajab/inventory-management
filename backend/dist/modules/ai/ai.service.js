"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const sales_service_1 = require("../sales/sales.service");
const inventory_service_1 = require("../inventory/inventory.service");
const date_fns_1 = require("date-fns");
let AiService = class AiService {
    salesService;
    inventoryService;
    constructor(salesService, inventoryService) {
        this.salesService = salesService;
        this.inventoryService = inventoryService;
    }
    async getSalesForecast() {
        const salesResponse = await this.salesService.findAll({ limit: 10000 });
        const sales = salesResponse.data;
        const dailyData = new Map();
        const last30Days = Array.from({ length: 30 }, (_, i) => (0, date_fns_1.format)((0, date_fns_1.subDays)(new Date(), i), 'yyyy-MM-dd')).reverse();
        last30Days.forEach(date => dailyData.set(date, 0));
        sales.forEach((sale) => {
            const date = (0, date_fns_1.format)(new Date(sale.createdAt), 'yyyy-MM-dd');
            if (dailyData.has(date)) {
                dailyData.set(date, dailyData.get(date) + sale.totalAmount);
            }
        });
        const chartData = last30Days.map(date => ({
            date,
            actual: dailyData.get(date) || 0,
            forecast: 0
        }));
        for (let i = 7; i < chartData.length; i++) {
            const last7Days = chartData.slice(i - 7, i);
            const avg = last7Days.reduce((acc, curr) => acc + curr.actual, 0) / 7;
            chartData[i].forecast = Math.round(avg * 100) / 100;
        }
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
    calculateGrowth(data) {
        if (data.length < 14)
            return 0;
        const currentWeek = data.slice(-7).reduce((acc, curr) => acc + curr.actual, 0);
        const prevWeek = data.slice(-14, -7).reduce((acc, curr) => acc + curr.actual, 0);
        if (prevWeek === 0)
            return 0;
        return Math.round(((currentWeek - prevWeek) / prevWeek) * 100);
    }
    async getStockOptimization() {
        const productsResponse = await this.inventoryService.findAll({ limit: 10000 });
        const salesResponse = await this.salesService.findAll({ limit: 10000 });
        const products = productsResponse.data;
        const sales = salesResponse.data;
        const recommendations = products.map((product) => {
            const productSales = sales.flatMap((s) => s.items)
                .filter((item) => item.productId?.toString() === product._id.toString());
            const totalSold = productSales.reduce((acc, curr) => acc + curr.quantity, 0);
            const dailyVelocity = totalSold / 30;
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
        }).filter((r) => r.recommendedReorder > 0 || r.daysRemaining < 7);
        return recommendations.sort((a, b) => a.daysRemaining - b.daysRemaining);
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sales_service_1.SalesService,
        inventory_service_1.InventoryService])
], AiService);
//# sourceMappingURL=ai.service.js.map
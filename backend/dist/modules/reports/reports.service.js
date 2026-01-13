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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const sales_service_1 = require("../sales/sales.service");
const inventory_service_1 = require("../inventory/inventory.service");
const date_fns_1 = require("date-fns");
let ReportsService = class ReportsService {
    salesService;
    inventoryService;
    constructor(salesService, inventoryService) {
        this.salesService = salesService;
        this.inventoryService = inventoryService;
    }
    async getProfitLossReport(period, date) {
        const salesResponse = await this.salesService.findAll({ limit: 10000 });
        const productsResponse = await this.inventoryService.findAll({ limit: 10000 });
        const sales = salesResponse.data;
        const products = productsResponse.data;
        const productMap = new Map(products.map((p) => [p._id.toString(), p]));
        const targetDate = date ? new Date(date) : new Date();
        let start, end;
        if (period === 'monthly') {
            start = (0, date_fns_1.startOfMonth)(targetDate);
            end = (0, date_fns_1.endOfMonth)(targetDate);
        }
        else if (period === 'quarterly') {
            start = (0, date_fns_1.startOfQuarter)(targetDate);
            end = (0, date_fns_1.endOfQuarter)(targetDate);
        }
        else {
            start = new Date(targetDate.getFullYear(), 0, 1);
            end = new Date(targetDate.getFullYear(), 11, 31, 23, 59, 59);
        }
        const periodSales = sales.filter((sale) => {
            const d = new Date(sale.createdAt);
            return d >= start && d <= end;
        });
        let totalRevenue = 0;
        let totalCost = 0;
        let totalTax = 0;
        periodSales.forEach((sale) => {
            totalRevenue += sale.totalAmount - sale.taxAmount;
            totalTax += sale.taxAmount;
            sale.items.forEach((item) => {
                const product = productMap.get(item.productId.toString());
                if (product) {
                    totalCost += (product.purchasePrice || 0) * item.quantity;
                }
            });
        });
        return {
            period,
            start: (0, date_fns_1.format)(start, 'yyyy-MM-dd'),
            end: (0, date_fns_1.format)(end, 'yyyy-MM-dd'),
            revenue: Math.round(totalRevenue * 100) / 100,
            costOfGoodsSold: Math.round(totalCost * 100) / 100,
            grossProfit: Math.round((totalRevenue - totalCost) * 100) / 100,
            taxCollected: Math.round(totalTax * 100) / 100,
            margin: totalRevenue > 0 ? Math.round(((totalRevenue - totalCost) / totalRevenue) * 100) : 0,
            transactionCount: periodSales.length
        };
    }
    async getGstReport(month, year) {
        const salesResponse = await this.salesService.findAll({ limit: 10000 });
        const sales = salesResponse.data;
        const start = (0, date_fns_1.startOfMonth)(new Date(year, month - 1));
        const end = (0, date_fns_1.endOfMonth)(new Date(year, month - 1));
        const monthSales = sales.filter((sale) => {
            const d = new Date(sale.createdAt);
            return d >= start && d <= end;
        });
        let b2bCount = 0;
        let b2cCount = 0;
        let totalTaxableValue = 0;
        let totalCgst = 0;
        let totalSgst = 0;
        let totalIgst = 0;
        const details = monthSales.map((sale) => {
            const isB2B = !!sale.customerId?.gstin;
            if (isB2B)
                b2bCount++;
            else
                b2cCount++;
            const taxable = sale.totalAmount - sale.taxAmount;
            totalTaxableValue += taxable;
            totalCgst += sale.cgst || 0;
            totalSgst += sale.sgst || 0;
            totalIgst += sale.igst || 0;
            return {
                date: (0, date_fns_1.format)(new Date(sale.createdAt), 'yyyy-MM-dd'),
                invoiceNumber: sale.invoiceNumber,
                customer: sale.customerId?.name || 'Walk-in',
                gstin: sale.customerId?.gstin || 'URD',
                taxableValue: Math.round(taxable * 100) / 100,
                cgst: Math.round((sale.cgst || 0) * 100) / 100,
                sgst: Math.round((sale.sgst || 0) * 100) / 100,
                igst: Math.round((sale.igst || 0) * 100) / 100,
                total: Math.round(sale.totalAmount * 100) / 100
            };
        });
        return {
            month: (0, date_fns_1.format)(start, 'MMMM yyyy'),
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
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sales_service_1.SalesService,
        inventory_service_1.InventoryService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map
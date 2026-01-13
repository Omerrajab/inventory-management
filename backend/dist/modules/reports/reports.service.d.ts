import { SalesService } from '../sales/sales.service';
import { InventoryService } from '../inventory/inventory.service';
export declare class ReportsService {
    private readonly salesService;
    private readonly inventoryService;
    constructor(salesService: SalesService, inventoryService: InventoryService);
    getProfitLossReport(period: 'monthly' | 'quarterly' | 'yearly', date?: string): Promise<{
        period: "monthly" | "quarterly" | "yearly";
        start: string;
        end: string;
        revenue: number;
        costOfGoodsSold: number;
        grossProfit: number;
        taxCollected: number;
        margin: number;
        transactionCount: any;
    }>;
    getGstReport(month: number, year: number): Promise<{
        month: string;
        summary: {
            b2bCount: number;
            b2cCount: number;
            totalTaxableValue: number;
            totalCgst: number;
            totalSgst: number;
            totalIgst: number;
            totalTax: number;
        };
        details: any;
    }>;
}

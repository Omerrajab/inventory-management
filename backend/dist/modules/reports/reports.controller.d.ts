import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getProfitLoss(period: 'monthly' | 'quarterly' | 'yearly', date?: string): Promise<{
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
    getGst(month: string, year: string): Promise<{
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

import { SalesService } from '../sales/sales.service';
import { InventoryService } from '../inventory/inventory.service';
export declare class AiService {
    private readonly salesService;
    private readonly inventoryService;
    constructor(salesService: SalesService, inventoryService: InventoryService);
    getSalesForecast(): Promise<{
        timeline: {
            date: string;
            actual: number;
            forecast: number;
        }[];
        insights: {
            predictedWeeklyDemand: number;
            growthRate: number;
            confidence: string;
        };
    }>;
    private calculateGrowth;
    getStockOptimization(): Promise<any>;
}

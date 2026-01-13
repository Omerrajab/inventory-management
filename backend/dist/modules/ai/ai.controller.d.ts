import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    getForecast(): Promise<{
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
    getStockOptimization(): Promise<any>;
}

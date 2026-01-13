import { Controller, Get } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Get('forecast')
    getForecast() {
        return this.aiService.getSalesForecast();
    }

    @Get('stock-optimization')
    getStockOptimization() {
        return this.aiService.getStockOptimization();
    }
}



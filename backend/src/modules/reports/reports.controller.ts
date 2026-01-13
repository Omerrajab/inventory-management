import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get('profit-loss')
    getProfitLoss(
        @Query('period') period: 'monthly' | 'quarterly' | 'yearly',
        @Query('date') date?: string
    ) {
        return this.reportsService.getProfitLossReport(period || 'monthly', date);
    }

    @Get('gst')
    getGst(
        @Query('month') month: string,
        @Query('year') year: string
    ) {
        return this.reportsService.getGstReport(parseInt(month), parseInt(year));
    }
}


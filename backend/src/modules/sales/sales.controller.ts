import { Controller, Get, Post, Body, Param, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { SalesService } from './sales.service';
import { BillingService } from '../billing/billing.service';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

@Controller('sales')
export class SalesController {
    constructor(
        private readonly salesService: SalesService,
        private readonly billingService: BillingService,
    ) { }

    @Post()
    create(@Body() createSaleDto: any) {
        return this.salesService.create(createSaleDto);
    }

    @Get()
    findAll(@Query() query: PaginationQueryDto) {
        return this.salesService.findAll(query);
    }


    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.salesService.findOne(id);
    }

    @Get(':id/invoice')
    async getInvoice(@Param('id') id: string, @Res() res: any) {

        const sale = await this.salesService.findOne(id);
        if (!sale) return res.status(404).send('Sale not found');

        const buffer = await this.billingService.generateInvoice(sale);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=invoice-${sale.invoiceNumber}.pdf`,
            'Content-Length': buffer.length,
        });

        res.end(buffer);
    }
}


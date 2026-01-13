import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MovementType } from './schemas/stock-movement.schema';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Post('products')
    create(@Body() createProductDto: CreateProductDto) {
        return this.inventoryService.create(createProductDto);
    }

    @Get('products')
    findAll(@Query() query: PaginationQueryDto) {
        return this.inventoryService.findAll(query);
    }


    @Get('products/:id')
    findOne(@Param('id') id: string) {
        return this.inventoryService.findOne(id);
    }

    @Patch('products/:id')
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.inventoryService.update(id, updateProductDto);
    }

    @Delete('products/:id')
    remove(@Param('id') id: string) {
        return this.inventoryService.remove(id);
    }

    @Post('products/:id/stock')
    updateStock(
        @Param('id') id: string,
        @Body('quantity') quantity: number,
        @Body('type') type: MovementType,
        @Body('reason') reason?: string,
        @Body('performedBy') performedBy?: string,
    ) {
        return this.inventoryService.updateStock(id, quantity, type, reason, performedBy);
    }
}


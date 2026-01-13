import { IsString, IsNumber, IsOptional, Min, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    sku: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    @Transform(({ value }) => value === "" ? null : value)
    categoryId?: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    purchasePrice?: number;


    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsOptional()
    qrCode?: string;

    @IsString()
    @IsOptional()
    barCode?: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    minStockLevel?: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    maxStockLevel?: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    reorderPoint?: number;

    @IsString()
    @IsOptional()
    unit?: string;

    @IsString()
    @IsOptional()
    hsnCode?: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    gstRate?: number;


    @IsNumber()
    @Min(0)
    @IsOptional()
    quantity?: number;
}


export declare class CreateProductDto {
    name: string;
    sku: string;
    description?: string;
    categoryId?: string;
    purchasePrice?: number;
    price: number;
    qrCode?: string;
    barCode?: string;
    minStockLevel?: number;
    maxStockLevel?: number;
    reorderPoint?: number;
    unit?: string;
    hsnCode?: string;
    gstRate?: number;
    quantity?: number;
}

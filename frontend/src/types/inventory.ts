export interface Product {
    _id: string;
    name: string;
    sku: string;
    description?: string;
    categoryId?: string;
    category?: {
        _id: string;
        name: string;
    };
    purchasePrice: number;
    price: number;
    quantity: number;
    minStockLevel?: number;
    maxStockLevel?: number;
    reorderPoint: number;
    unit?: string;
    hsnCode?: string;
    gstRate?: number;

    qrCode?: string;
    barCode?: string;

    createdAt: string;

    updatedAt: string;
}

export enum MovementType {
    IN = 'IN',
    OUT = 'OUT',
    ADJUSTMENT = 'ADJUSTMENT',
    TRANSFER = 'TRANSFER',
}

export interface StockMovement {
    _id: string;
    productId: string;
    quantity: number;
    type: MovementType;
    reason?: string;
    performedBy?: string;
    createdAt: string;
}

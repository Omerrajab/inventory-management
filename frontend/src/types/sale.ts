export enum PaymentStatus {
    PAID = 'PAID',
    PENDING = 'PENDING',
    PARTIAL = 'PARTIAL',
}

export enum PaymentMethod {
    CASH = 'CASH',
    CARD = 'CARD',
    TRANSFER = 'TRANSFER',
    CREDIT = 'CREDIT',
}

export interface SaleItem {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    gstRate: number;
    gstAmount: number;
    subtotal: number;
}

export interface Sale {
    _id: string;
    customerId?: string;
    items: SaleItem[];
    totalAmount: number;
    taxAmount: number;
    cgst?: number;
    sgst?: number;
    igst?: number;
    discountAmount: number;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    invoiceNumber: string;
    notes?: string;

    createdAt: string;
    updatedAt: string;
}

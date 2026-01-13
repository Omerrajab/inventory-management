export interface Customer {
    _id: string;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    gstin?: string;
    state?: string;

    balance: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export enum LedgerEntryType {
    SALE = 'SALE',
    PAYMENT = 'PAYMENT',
    RETURN = 'RETURN',
    ADJUSTMENT = 'ADJUSTMENT',
}

export interface LedgerEntry {
    _id: string;
    customerId: string;
    type: LedgerEntryType;
    amount: number;
    balanceAfter: number;
    referenceId?: string;
    description: string;
    createdAt: string;
}

export interface CustomerPayment {
    _id: string;
    customerId: string;
    amount: number;
    method: string;
    transactionId?: string;
    notes?: string;
    createdAt: string;
}


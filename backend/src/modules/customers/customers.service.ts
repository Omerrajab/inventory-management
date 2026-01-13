import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { CustomerLedger, CustomerLedgerDocument, LedgerEntryType } from './schemas/ledger.schema';
import { CustomerPayment, CustomerPaymentDocument } from './schemas/payment.schema';

@Injectable()
export class CustomersService {
    constructor(
        @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
        @InjectModel(CustomerLedger.name) private ledgerModel: Model<CustomerLedgerDocument>,
        @InjectModel(CustomerPayment.name) private paymentModel: Model<CustomerPaymentDocument>,
    ) { }

    async create(createCustomerDto: any): Promise<Customer> {
        const customer = new this.customerModel(createCustomerDto);
        return customer.save();
    }

    async findAll(query: any = {}): Promise<any> {
        const { page = 1, limit = 10, search, sortBy = 'name', sortOrder = 'asc' } = query;
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ];
        }

        const sort: any = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const [data, total] = await Promise.all([
            this.customerModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.customerModel.countDocuments(filter).exec(),
        ]);

        return {
            data,
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
        };
    }


    async findOne(id: string): Promise<CustomerDocument> {
        const customer = await this.customerModel.findById(id).exec();
        if (!customer) {
            throw new NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer;
    }

    // Ledger & Balance Methods
    async recordLedgerEntry(customerId: string, type: LedgerEntryType, amount: number, referenceId?: string, description?: string) {
        const customer = await this.findOne(customerId);

        // Update customer balance
        // Debit increases balance (customer owes more), Credit decreases it (customer pays)
        // In our case, amount is positive for Debit, negative for Credit
        customer.balance += amount;
        await customer.save();

        const entry = new this.ledgerModel({
            customerId,
            type,
            amount,
            balanceAfter: customer.balance,
            referenceId,
            description
        });

        return entry.save();
    }

    async recordPayment(paymentDto: any) {
        const { customerId, amount, method, transactionId, notes } = paymentDto;
        const customer = await this.findOne(customerId);

        const payment = new this.paymentModel({
            customerId,
            amount,
            method,
            transactionId,
            notes
        });

        const savedPayment = await payment.save();

        // Record it in ledger as a CREDIT (decrease balance)
        await this.recordLedgerEntry(
            customerId,
            LedgerEntryType.PAYMENT,
            -amount,
            savedPayment._id.toString(),
            `Payment received via ${method}`
        );

        return savedPayment;
    }

    async getLedger(customerId: string) {
        return this.ledgerModel.find({ customerId })
            .sort({ createdAt: -1 })
            .exec();
    }

    async update(id: string, updateCustomerDto: any): Promise<Customer> {

        const customer = await this.customerModel.findByIdAndUpdate(id, updateCustomerDto, { new: true }).exec();
        if (!customer) {
            throw new NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer;
    }

    async remove(id: string): Promise<Customer> {
        const customer = await this.customerModel.findByIdAndDelete(id).exec();
        if (!customer) {
            throw new NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer;
    }
}

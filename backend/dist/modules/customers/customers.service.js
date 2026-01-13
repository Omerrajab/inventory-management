"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const customer_schema_1 = require("./schemas/customer.schema");
const ledger_schema_1 = require("./schemas/ledger.schema");
const payment_schema_1 = require("./schemas/payment.schema");
let CustomersService = class CustomersService {
    customerModel;
    ledgerModel;
    paymentModel;
    constructor(customerModel, ledgerModel, paymentModel) {
        this.customerModel = customerModel;
        this.ledgerModel = ledgerModel;
        this.paymentModel = paymentModel;
    }
    async create(createCustomerDto) {
        const customer = new this.customerModel(createCustomerDto);
        return customer.save();
    }
    async findAll(query = {}) {
        const { page = 1, limit = 10, search, sortBy = 'name', sortOrder = 'asc' } = query;
        const skip = (page - 1) * limit;
        const filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ];
        }
        const sort = {};
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
    async findOne(id) {
        const customer = await this.customerModel.findById(id).exec();
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer;
    }
    async recordLedgerEntry(customerId, type, amount, referenceId, description) {
        const customer = await this.findOne(customerId);
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
    async recordPayment(paymentDto) {
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
        await this.recordLedgerEntry(customerId, ledger_schema_1.LedgerEntryType.PAYMENT, -amount, savedPayment._id.toString(), `Payment received via ${method}`);
        return savedPayment;
    }
    async getLedger(customerId) {
        return this.ledgerModel.find({ customerId })
            .sort({ createdAt: -1 })
            .exec();
    }
    async update(id, updateCustomerDto) {
        const customer = await this.customerModel.findByIdAndUpdate(id, updateCustomerDto, { new: true }).exec();
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer;
    }
    async remove(id) {
        const customer = await this.customerModel.findByIdAndDelete(id).exec();
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer;
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(customer_schema_1.Customer.name)),
    __param(1, (0, mongoose_1.InjectModel)(ledger_schema_1.CustomerLedger.name)),
    __param(2, (0, mongoose_1.InjectModel)(payment_schema_1.CustomerPayment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], CustomersService);
//# sourceMappingURL=customers.service.js.map
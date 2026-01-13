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
exports.SalesController = void 0;
const common_1 = require("@nestjs/common");
const sales_service_1 = require("./sales.service");
const billing_service_1 = require("../billing/billing.service");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let SalesController = class SalesController {
    salesService;
    billingService;
    constructor(salesService, billingService) {
        this.salesService = salesService;
        this.billingService = billingService;
    }
    create(createSaleDto) {
        return this.salesService.create(createSaleDto);
    }
    findAll(query) {
        return this.salesService.findAll(query);
    }
    findOne(id) {
        return this.salesService.findOne(id);
    }
    async getInvoice(id, res) {
        const sale = await this.salesService.findOne(id);
        if (!sale)
            return res.status(404).send('Sale not found');
        const buffer = await this.billingService.generateInvoice(sale);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=invoice-${sale.invoiceNumber}.pdf`,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
};
exports.SalesController = SalesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/invoice'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "getInvoice", null);
exports.SalesController = SalesController = __decorate([
    (0, common_1.Controller)('sales'),
    __metadata("design:paramtypes", [sales_service_1.SalesService,
        billing_service_1.BillingService])
], SalesController);
//# sourceMappingURL=sales.controller.js.map
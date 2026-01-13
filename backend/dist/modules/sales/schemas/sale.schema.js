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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleSchema = exports.Sale = exports.PaymentMethod = exports.PaymentStatus = exports.SaleItem = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let SaleItem = class SaleItem {
    productId;
    name;
    quantity;
    price;
    gstRate;
    gstAmount;
    subtotal;
};
exports.SaleItem = SaleItem;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Product', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SaleItem.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SaleItem.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], SaleItem.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], SaleItem.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], SaleItem.prototype, "gstRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], SaleItem.prototype, "gstAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], SaleItem.prototype, "subtotal", void 0);
exports.SaleItem = SaleItem = __decorate([
    (0, mongoose_1.Schema)()
], SaleItem);
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PARTIAL"] = "PARTIAL";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "CASH";
    PaymentMethod["CARD"] = "CARD";
    PaymentMethod["TRANSFER"] = "TRANSFER";
    PaymentMethod["CREDIT"] = "CREDIT";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
let Sale = class Sale {
    customerId;
    items;
    totalAmount;
    taxAmount;
    cgst;
    sgst;
    igst;
    discountAmount;
    paymentStatus;
    paymentMethod;
    invoiceNumber;
    notes;
    createdAt;
    updatedAt;
};
exports.Sale = Sale;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Customer' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Sale.prototype, "customerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [SaleItem], required: true }),
    __metadata("design:type", Array)
], Sale.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Sale.prototype, "totalAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Sale.prototype, "taxAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Sale.prototype, "cgst", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Sale.prototype, "sgst", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Sale.prototype, "igst", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Sale.prototype, "discountAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: PaymentStatus, default: PaymentStatus.PAID }),
    __metadata("design:type", String)
], Sale.prototype, "paymentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: PaymentMethod, default: PaymentMethod.CASH }),
    __metadata("design:type", String)
], Sale.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Sale.prototype, "invoiceNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Sale.prototype, "notes", void 0);
exports.Sale = Sale = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Sale);
exports.SaleSchema = mongoose_1.SchemaFactory.createForClass(Sale);
//# sourceMappingURL=sale.schema.js.map
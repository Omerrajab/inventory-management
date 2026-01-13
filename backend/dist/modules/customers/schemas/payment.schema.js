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
exports.CustomerPaymentSchema = exports.CustomerPayment = exports.PaymentMethod = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "CASH";
    PaymentMethod["CARD"] = "CARD";
    PaymentMethod["TRANSFER"] = "TRANSFER";
    PaymentMethod["UPI"] = "UPI";
    PaymentMethod["CHEQUE"] = "CHEQUE";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
let CustomerPayment = class CustomerPayment {
    customerId;
    amount;
    method;
    transactionId;
    notes;
};
exports.CustomerPayment = CustomerPayment;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Customer', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CustomerPayment.prototype, "customerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], CustomerPayment.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: PaymentMethod, default: PaymentMethod.CASH }),
    __metadata("design:type", String)
], CustomerPayment.prototype, "method", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CustomerPayment.prototype, "transactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CustomerPayment.prototype, "notes", void 0);
exports.CustomerPayment = CustomerPayment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], CustomerPayment);
exports.CustomerPaymentSchema = mongoose_1.SchemaFactory.createForClass(CustomerPayment);
//# sourceMappingURL=payment.schema.js.map
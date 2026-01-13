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
exports.CustomerLedgerSchema = exports.CustomerLedger = exports.LedgerEntryType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var LedgerEntryType;
(function (LedgerEntryType) {
    LedgerEntryType["SALE"] = "SALE";
    LedgerEntryType["PAYMENT"] = "PAYMENT";
    LedgerEntryType["RETURN"] = "RETURN";
    LedgerEntryType["ADJUSTMENT"] = "ADJUSTMENT";
})(LedgerEntryType || (exports.LedgerEntryType = LedgerEntryType = {}));
let CustomerLedger = class CustomerLedger {
    customerId;
    type;
    amount;
    balanceAfter;
    referenceId;
    description;
};
exports.CustomerLedger = CustomerLedger;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Customer', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CustomerLedger.prototype, "customerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: LedgerEntryType }),
    __metadata("design:type", String)
], CustomerLedger.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], CustomerLedger.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], CustomerLedger.prototype, "balanceAfter", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CustomerLedger.prototype, "referenceId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CustomerLedger.prototype, "description", void 0);
exports.CustomerLedger = CustomerLedger = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], CustomerLedger);
exports.CustomerLedgerSchema = mongoose_1.SchemaFactory.createForClass(CustomerLedger);
//# sourceMappingURL=ledger.schema.js.map
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
exports.ProductSchema = exports.Product = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Product = class Product {
    name;
    sku;
    description;
    categoryId;
    purchasePrice;
    price;
    hsnCode;
    gstRate;
    qrCode;
    barCode;
    minStockLevel;
    maxStockLevel;
    quantity;
    reorderPoint;
    unit;
};
exports.Product = Product;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Product.prototype, "sku", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Category' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Product.prototype, "categoryId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "purchasePrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Product.prototype, "hsnCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 18 }),
    __metadata("design:type", Number)
], Product.prototype, "gstRate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Product.prototype, "qrCode", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Product.prototype, "barCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "minStockLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Product.prototype, "maxStockLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "reorderPoint", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Product.prototype, "unit", void 0);
exports.Product = Product = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Product);
exports.ProductSchema = mongoose_1.SchemaFactory.createForClass(Product);
//# sourceMappingURL=product.schema.js.map
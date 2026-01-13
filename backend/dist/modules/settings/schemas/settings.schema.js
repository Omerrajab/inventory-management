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
exports.CategorySchema = exports.Category = exports.SettingsSchema = exports.Settings = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Settings = class Settings {
    companyName;
    address;
    gstin;
    logoUrl;
    email;
    phone;
};
exports.Settings = Settings;
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'ANTIGRAVITY INVENTORY' }),
    __metadata("design:type", String)
], Settings.prototype, "companyName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: '123 Modern Tech Park, Hinjewadi, Pune, Maharashtra - 411057' }),
    __metadata("design:type", String)
], Settings.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: '27AAAAA0000A1Z5' }),
    __metadata("design:type", String)
], Settings.prototype, "gstin", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Settings.prototype, "logoUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Settings.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Settings.prototype, "phone", void 0);
exports.Settings = Settings = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Settings);
exports.SettingsSchema = mongoose_1.SchemaFactory.createForClass(Settings);
let Category = class Category {
    name;
    parentId;
};
exports.Category = Category;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Category', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Category.prototype, "parentId", void 0);
exports.Category = Category = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Category);
exports.CategorySchema = mongoose_1.SchemaFactory.createForClass(Category);
//# sourceMappingURL=settings.schema.js.map
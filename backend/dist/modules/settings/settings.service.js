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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const settings_schema_1 = require("./schemas/settings.schema");
let SettingsService = class SettingsService {
    settingsModel;
    categoryModel;
    constructor(settingsModel, categoryModel) {
        this.settingsModel = settingsModel;
        this.categoryModel = categoryModel;
    }
    async onModuleInit() {
        const settings = await this.settingsModel.findOne().exec();
        if (!settings) {
            await this.settingsModel.create({
                companyName: 'ANTIGRAVITY INVENTORY',
                address: '123 Modern Tech Park, Hinjewadi, Pune, Maharashtra - 411057',
                gstin: '27AAAAA0000A1Z5',
            });
        }
    }
    async getSettings() {
        return this.settingsModel.findOne().exec();
    }
    async updateSettings(updateDto) {
        return this.settingsModel.findOneAndUpdate({}, updateDto, { new: true, upsert: true }).exec();
    }
    async createCategory(dto) {
        const category = new this.categoryModel(dto);
        return category.save();
    }
    async findAllCategories() {
        return this.categoryModel.find().populate('parentId').exec();
    }
    async deleteCategory(id) {
        return this.categoryModel.findByIdAndDelete(id).exec();
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(settings_schema_1.Settings.name)),
    __param(1, (0, mongoose_1.InjectModel)(settings_schema_1.Category.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], SettingsService);
//# sourceMappingURL=settings.service.js.map
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Settings, SettingsDocument, Category, CategoryDocument } from './schemas/settings.schema';

@Injectable()
export class SettingsService implements OnModuleInit {
    constructor(
        @InjectModel(Settings.name) private settingsModel: Model<SettingsDocument>,
        @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    ) { }

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

    async getSettings(): Promise<SettingsDocument> {
        return this.settingsModel.findOne().exec() as any;
    }


    async updateSettings(updateDto: any): Promise<Settings> {
        return this.settingsModel.findOneAndUpdate({}, updateDto, { new: true, upsert: true }).exec();
    }

    // Category Methods
    async createCategory(dto: any): Promise<Category> {
        const category = new this.categoryModel(dto);
        return category.save();
    }

    async findAllCategories(): Promise<Category[]> {
        return this.categoryModel.find().populate('parentId').exec();
    }

    async deleteCategory(id: string): Promise<any> {
        return this.categoryModel.findByIdAndDelete(id).exec();
    }
}


import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { Settings, SettingsDocument, Category, CategoryDocument } from './schemas/settings.schema';
export declare class SettingsService implements OnModuleInit {
    private settingsModel;
    private categoryModel;
    constructor(settingsModel: Model<SettingsDocument>, categoryModel: Model<CategoryDocument>);
    onModuleInit(): Promise<void>;
    getSettings(): Promise<SettingsDocument>;
    updateSettings(updateDto: any): Promise<Settings>;
    createCategory(dto: any): Promise<Category>;
    findAllCategories(): Promise<Category[]>;
    deleteCategory(id: string): Promise<any>;
}

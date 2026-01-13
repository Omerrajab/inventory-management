import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<import("./schemas/settings.schema").SettingsDocument>;
    updateSettings(updateDto: any): Promise<import("./schemas/settings.schema").Settings>;
    findAllCategories(): Promise<import("./schemas/settings.schema").Category[]>;
    createCategory(dto: any): Promise<import("./schemas/settings.schema").Category>;
    deleteCategory(id: string): Promise<any>;
}

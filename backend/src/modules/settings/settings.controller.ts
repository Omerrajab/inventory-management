import { Controller, Get, Patch, Post, Body, Delete, Param } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    getSettings() {
        return this.settingsService.getSettings();
    }

    @Patch()
    updateSettings(@Body() updateDto: any) {
        return this.settingsService.updateSettings(updateDto);
    }

    @Get('categories')
    findAllCategories() {
        return this.settingsService.findAllCategories();
    }

    @Post('categories')
    createCategory(@Body() dto: any) {
        return this.settingsService.createCategory(dto);
    }

    @Delete('categories/:id')
    deleteCategory(@Param('id') id: string) {
        return this.settingsService.deleteCategory(id);
    }
}


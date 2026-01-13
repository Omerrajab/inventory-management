import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Settings, SettingsSchema, Category, CategorySchema } from './schemas/settings.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Settings.name, schema: SettingsSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [SettingsService],
  controllers: [SettingsController],
  exports: [SettingsService],
})

export class SettingsModule { }

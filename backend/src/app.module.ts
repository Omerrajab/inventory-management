import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InventoryModule } from './modules/inventory/inventory.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CustomersModule } from './modules/customers/customers.module';
import { SalesModule } from './modules/sales/sales.module';
import { BillingModule } from './modules/billing/billing.module';
import { AiModule } from './modules/ai/ai.module';
import { SettingsModule } from './modules/settings/settings.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    InventoryModule,
    NotificationsModule,
    CustomersModule,
    SalesModule,
    BillingModule,
    AiModule,
    SettingsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


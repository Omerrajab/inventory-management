import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

import { SalesModule } from '../sales/sales.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [SalesModule, InventoryModule],
  providers: [ReportsService],
  controllers: [ReportsController]
})

export class ReportsModule { }

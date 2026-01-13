import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';

import { SalesModule } from '../sales/sales.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [SalesModule, InventoryModule],

  providers: [AiService],
  controllers: [AiController]
})

export class AiModule { }

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sale, SaleSchema } from './schemas/sale.schema';
import { InventoryModule } from '../inventory/inventory.module';
import { CustomersModule } from '../customers/customers.module';
import { BillingModule } from '../billing/billing.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sale.name, schema: SaleSchema }]),
    InventoryModule,
    CustomersModule,
    BillingModule,
  ],


  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule { }

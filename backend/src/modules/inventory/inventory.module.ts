import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { StockMovement, StockMovementSchema } from './schemas/stock-movement.schema';
import { InventoryGateway } from './inventory.gateway';
import { NotificationsModule } from '../notifications/notifications.module';



@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: StockMovement.name, schema: StockMovementSchema },
    ]),
    NotificationsModule,
  ],

  controllers: [InventoryController],
  providers: [InventoryService, InventoryGateway],
  exports: [InventoryService, InventoryGateway],
})


export class InventoryModule { }


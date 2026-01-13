import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import { CustomerLedger, CustomerLedgerSchema } from './schemas/ledger.schema';
import { CustomerPayment, CustomerPaymentSchema } from './schemas/payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: CustomerLedger.name, schema: CustomerLedgerSchema },
      { name: CustomerPayment.name, schema: CustomerPaymentSchema },
    ]),
  ],

  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule { }

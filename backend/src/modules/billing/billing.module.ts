import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { SettingsModule } from '../settings/settings.module';


@Module({
  imports: [SettingsModule],
  providers: [BillingService],
  exports: [BillingService],
})


export class BillingModule { }

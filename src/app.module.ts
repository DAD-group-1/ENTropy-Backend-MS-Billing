import { Module } from '@nestjs/common';
import { PaymentModule } from './core/payments/payment.module';
import { DatabaseModule } from './database/database.module';
import { PaymentMethodModule } from './core/payment-methods/payment-method.module';

@Module({
  imports: [DatabaseModule, PaymentMethodModule, PaymentModule],
})
export class AppModule {}

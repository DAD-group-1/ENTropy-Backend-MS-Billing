import { Entity, OneToMany } from 'typeorm';
import { InternalPaymentMethod } from '@dad-group-1/backend-common';
import { Payment } from '../../payments/entities/payment.entity';

@Entity()
export class PaymentMethod extends InternalPaymentMethod {
  @OneToMany(() => Payment, (payment) => payment.paymentMethod)
  payments: Payment[];
}

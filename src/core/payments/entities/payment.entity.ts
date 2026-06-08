import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { InternalPayment } from '@dad-group-1/backend-common';
import { PaymentMethod } from '../../payment-methods/entities/payment-method.entity';
import { User } from '../../external/entities/user.entity';

@Entity()
export class Payment extends InternalPayment {
  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'student_id' })
  user: User;
  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.payments)
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;
}

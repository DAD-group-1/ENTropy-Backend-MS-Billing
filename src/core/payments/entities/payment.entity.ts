import { Entity, ManyToOne } from 'typeorm';
import { InternalPayment } from '@dad-group-1/backend-common';
import { Student } from '../../external/entities/student.entity';
import { PaymentMethod } from '../../payment-methods/entities/payment-method.entity';

@Entity()
export class Payment extends InternalPayment {
  @ManyToOne(() => Student, (student) => student.payments)
  student: Student;
  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.payments)
  paymentMethod: PaymentMethod;
}

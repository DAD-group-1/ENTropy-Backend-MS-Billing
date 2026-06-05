import { InternalStudent } from '@dad-group-1/backend-common';
import { Entity, OneToMany, OneToOne } from 'typeorm';
import { Payment } from '../../payments/entities/payment.entity';
import { User } from './user.entity';

@Entity()
export class Student extends InternalStudent {
  @OneToOne(() => User, (user) => user.student)
  user: User;
  @OneToMany(() => Payment, (payment) => payment.student)
  payments: Payment[];
}

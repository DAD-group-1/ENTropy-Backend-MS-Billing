import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { InternalUser } from '@dad-group-1/backend-common';
import { Campus } from './campus.entity';
import { Student } from './student.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Role } from './role.entity';

@Entity()
export class User extends InternalUser {
  @OneToOne(() => Student, (student) => student.user)
  student: Student;
  @ManyToOne(() => Campus, (campus) => campus.users)
  @JoinColumn({ name: 'campus_id' })
  campus: Campus;
  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}

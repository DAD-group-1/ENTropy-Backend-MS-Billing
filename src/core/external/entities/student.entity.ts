import { InternalStudent } from '@dad-group-1/backend-common';
import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Student extends InternalStudent {
  @OneToOne(() => User, (user) => user.student)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

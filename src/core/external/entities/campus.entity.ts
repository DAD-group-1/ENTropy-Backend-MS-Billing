import { InternalCampus } from '@dad-group-1/backend-common';
import { Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Campus extends InternalCampus {
  @OneToMany(() => User, (user) => user.campus)
  users: User[];
}

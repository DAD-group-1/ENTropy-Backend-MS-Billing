import { Entity, OneToMany } from 'typeorm';
import { InternalRole } from '@dad-group-1/backend-common';
import { User } from './user.entity';

@Entity()
export class Role extends InternalRole {
  @OneToMany(() => User, (user) => user.role)
  users: User[];
}

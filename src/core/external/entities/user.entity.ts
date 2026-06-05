import { Entity, ManyToOne, OneToOne } from 'typeorm';
import { InternalUser } from '@dad-group-1/backend-common';
import { Campus } from './campus.entity';
import { Student } from './student.entity';

@Entity()
export class User extends InternalUser {
  @OneToOne(() => Student, (student) => student.user)
  student: Student;
  @ManyToOne(() => Campus, (campus) => campus.users)
  campus: Campus;
}

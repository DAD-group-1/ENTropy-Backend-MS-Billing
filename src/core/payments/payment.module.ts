import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from '../payment-methods/entities/payment-method.entity';
import { Payment } from './entities/payment.entity';
import { Student } from '../external/entities/student.entity';
import { Campus } from '../external/entities/campus.entity';
import { User } from '../external/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentMethod, Payment, Student, User, Campus]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}

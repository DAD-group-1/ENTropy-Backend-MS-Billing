import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreatePaymentRequestDto,
  PaginationQueryDto,
  SearchPaginationQueryDto,
  UpdatePaymentRequestDto,
} from '@dad-group-1/backend-common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern({ cmd: 'create_payment' })
  async create(@Payload() data: CreatePaymentRequestDto) {
    return this.paymentService.create(data);
  }

  @MessagePattern({ cmd: 'find_all_payments' })
  findAll(@Payload() query: PaginationQueryDto) {
    return this.paymentService.findAll(query);
  }

  @MessagePattern({ cmd: 'find_one_payment' })
  findOne(@Payload() id: number) {
    return this.paymentService.findOne(id);
  }

  @MessagePattern({ cmd: 'find_payments_by_student_id' })
  findAllByStudent(@Payload() query: SearchPaginationQueryDto) {
    return this.paymentService.findAllByStudent(query);
  }

  @MessagePattern({ cmd: 'update_payment' })
  update(
    @Payload()
    payload: {
      id: number;
      updateData: UpdatePaymentRequestDto;
    },
  ) {
    return this.paymentService.update(payload.id, payload.updateData);
  }

  @MessagePattern({ cmd: 'remove_payment' })
  remove(@Payload() id: number) {
    return this.paymentService.remove(id);
  }
}

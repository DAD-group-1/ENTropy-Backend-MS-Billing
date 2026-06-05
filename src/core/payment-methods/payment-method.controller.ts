import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreatePaymentMethodRequestDto,
  PaginationQueryDto,
  UpdatePaymentMethodRequestDto,
} from '@dad-group-1/backend-common';
import { PaymentMethodService } from './payment-method.service';

@Controller('payment')
export class PaymentMethodController {
  private readonly logger = new Logger(PaymentMethodController.name);
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @MessagePattern({ cmd: 'create_attendance' })
  async create(@Payload() data: CreatePaymentMethodRequestDto) {
    return this.paymentMethodService.create(data);
  }

  @MessagePattern({ cmd: 'find_all_attendances' })
  findAll(query: PaginationQueryDto) {
    return this.paymentMethodService.findAll(query);
  }

  @MessagePattern({ cmd: 'find_one_attendance' })
  findOne(@Payload() id: number) {
    return this.paymentMethodService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_attendance' })
  update(
    @Payload()
    payload: {
      id: number;
      updateData: UpdatePaymentMethodRequestDto;
    },
  ) {
    return this.paymentMethodService.update(payload.id, payload.updateData);
  }

  @MessagePattern({ cmd: 'remove_attendance' })
  remove(@Payload() id: number) {
    return this.paymentMethodService.remove(id);
  }
}

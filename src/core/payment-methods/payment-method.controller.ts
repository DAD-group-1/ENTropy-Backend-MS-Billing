import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreatePaymentMethodRequestDto,
  PaginationQueryDto,
  UpdatePaymentMethodRequestDto,
} from '@dad-group-1/backend-common';
import { PaymentMethodService } from './payment-method.service';

@Controller('payment-methods')
export class PaymentMethodController {
  private readonly logger = new Logger(PaymentMethodController.name);
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @MessagePattern({ cmd: 'create_payment_method' })
  async create(@Payload() data: CreatePaymentMethodRequestDto) {
    this.logger.log('Creating payment method request received');
    return this.paymentMethodService.create(data);
  }

  @MessagePattern({ cmd: 'find_all_payment_methods' })
  findAll(query: PaginationQueryDto) {
    this.logger.log('Finding all payment methods request received');
    return this.paymentMethodService.findAll(query);
  }

  @MessagePattern({ cmd: 'find_one_payment_method' })
  findOne(@Payload() id: number) {
    this.logger.log(
      'Finding one payment method request received for ID: ' + id,
    );
    return this.paymentMethodService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_payment_method' })
  update(
    @Payload()
    payload: {
      id: number;
      updateData: UpdatePaymentMethodRequestDto;
    },
  ) {
    this.logger.log(
      'Updating payment method request received for ID: ' + payload.id,
    );
    return this.paymentMethodService.update(payload.id, payload.updateData);
  }

  @MessagePattern({ cmd: 'remove_payment_method' })
  remove(@Payload() id: number) {
    this.logger.log('Removing payment method request received for ID: ' + id);
    return this.paymentMethodService.remove(id);
  }
}

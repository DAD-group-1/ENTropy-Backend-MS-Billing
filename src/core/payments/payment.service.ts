import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import {
  CreatePaymentRequestDto,
  PaginationQueryDto,
  PaymentListResponseDto,
  PaymentResponseDto,
  SearchPaginationQueryDto,
  UpdatePaymentRequestDto,
} from '@dad-group-1/backend-common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async create(
    createData: CreatePaymentRequestDto,
  ): Promise<PaymentResponseDto> {
    const payment = this.paymentRepository.create({ ...createData });
    try {
      return await this.paymentRepository.save(payment);
    } catch (error) {
      this.logger.error(
        `${error.constructor.name}: Failed to create payment record - ${error.message}`,
        error.stack,
      );
      throw new RpcException({
        message: `Failed to create payment record`,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findAll(query: PaginationQueryDto): Promise<PaymentListResponseDto> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await this.paymentRepository.findAndCount({
      relations: { student: true },
      skip,
      take: limit,
      order: { id: 'DESC' },
    });

    return new PaymentListResponseDto(data, total, page, limit);
  }

  async findOne(id: number): Promise<PaymentResponseDto | null> {
    const payment = await this.paymentRepository.findOne({
      where: { id: id },
      relations: { paymentMethod: true, student: true },
    });

    if (!payment) {
      throw new RpcException({
        message: `Payment with ID ${id} not found`,
        code: HttpStatus.NOT_FOUND,
      });
    }

    return payment;
  }

  async findAllByStudent(
    query: SearchPaginationQueryDto,
  ): Promise<PaymentListResponseDto> {
    const { page, limit } = query.query;
    const skip = (page - 1) * limit;

    const [data, total] = await this.paymentRepository.findAndCount({
      relations: { paymentMethod: true, student: { user: true } },
      skip,
      take: limit,
      order: { id: 'DESC' },
      where: { student: { user_id: query.id } },
    });

    return new PaymentListResponseDto(data, total, page, limit);
  }

  async update(
    id: number,
    updateData: UpdatePaymentRequestDto,
  ): Promise<PaymentResponseDto | null> {
    const payment = await this.paymentRepository.findOne({
      where: { id: id },
    });
    if (!payment) {
      this.logger.error(`Payment with ID ${id} not found for update`);
      throw new RpcException({
        message: `Payment with ID ${id} not found`,
        code: HttpStatus.NOT_FOUND,
      });
    }

    this.paymentRepository.merge(payment, updateData);
    return await this.paymentRepository.save(payment);
  }

  async remove(id: number): Promise<PaymentResponseDto | null> {
    const payment = await this.paymentRepository.findOne({
      where: { id: id },
    });
    if (!payment) {
      this.logger.error(`Payment with ID ${id} not found for deletion`);
      throw new RpcException({
        message: `Payment with ID ${id} not found`,
        code: HttpStatus.NOT_FOUND,
      });
    }

    await this.paymentRepository.remove(payment);
    return payment;
  }
}

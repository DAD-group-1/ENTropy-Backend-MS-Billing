import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import {
  CreatePaymentRequestDto,
  PaginationQueryDto,
  PaymentListResponseDto,
  PaymentResponseDto,
  UpdatePaymentRequestDto,
} from '@dad-group-1/backend-common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Payment)
    private attendanceRepository: Repository<Payment>,
  ) {}

  async create(
    createData: CreatePaymentRequestDto,
  ): Promise<PaymentResponseDto> {
    const attendance = this.attendanceRepository.create({ ...createData });
    try {
      return await this.attendanceRepository.save(attendance);
    } catch (error) {
      this.logger.error(
        `${error.constructor.name}: Failed to create attendance record - ${error.message}`,
        error.stack,
      );
      throw new RpcException({
        message: `Failed to create attendance record`,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findAll(query: PaginationQueryDto): Promise<PaymentListResponseDto> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await this.attendanceRepository.findAndCount({
      relations: { student: true },
      skip,
      take: limit,
      order: { id: 'DESC' },
    });

    return new PaymentListResponseDto(data, total, page, limit);
  }

  async findOne(id: number): Promise<PaymentResponseDto | null> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id: id },
      relations: { paymentMethod: true, student: true },
    });

    if (!attendance) {
      throw new RpcException({
        message: `Payment with ID ${id} not found`,
        code: HttpStatus.NOT_FOUND,
      });
    }

    return attendance;
  }

  async update(
    id: number,
    updateData: UpdatePaymentRequestDto,
  ): Promise<PaymentResponseDto | null> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id: id },
    });
    if (!attendance) {
      this.logger.error(`Payment with ID ${id} not found for update`);
      throw new RpcException({
        message: `Payment with ID ${id} not found`,
        code: HttpStatus.NOT_FOUND,
      });
    }

    this.attendanceRepository.merge(attendance, updateData);
    return await this.attendanceRepository.save(attendance);
  }

  async remove(id: number): Promise<PaymentResponseDto | null> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id: id },
    });
    if (!attendance) {
      this.logger.error(`Payment with ID ${id} not found for deletion`);
      throw new RpcException({
        message: `Payment with ID ${id} not found`,
        code: HttpStatus.NOT_FOUND,
      });
    }

    await this.attendanceRepository.remove(attendance);
    return attendance;
  }
}

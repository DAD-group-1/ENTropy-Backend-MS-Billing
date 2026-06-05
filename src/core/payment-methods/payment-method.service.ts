import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { Repository } from 'typeorm';
import {
  CreatePaymentMethodRequestDto,
  PaginationQueryDto,
  PaymentMethodListResponseDto,
  PaymentMethodResponseDto,
  UpdatePaymentMethodRequestDto,
} from '@dad-group-1/backend-common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PaymentMethodService {
  private readonly logger = new Logger(PaymentMethodService.name);

  constructor(
    @InjectRepository(PaymentMethod)
    private attendanceRepository: Repository<PaymentMethod>,
  ) {}

  async create(
    createData: CreatePaymentMethodRequestDto,
  ): Promise<PaymentMethodResponseDto> {
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

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaymentMethodListResponseDto> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await this.attendanceRepository.findAndCount({
      skip,
      take: limit,
      order: { id: 'DESC' },
    });

    return new PaymentMethodListResponseDto(data, total, page, limit);
  }

  async findOne(id: number): Promise<PaymentMethodResponseDto | null> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id: id },
    });

    if (!attendance) {
      throw new RpcException({
        message: `PaymentMethod with ID ${id} not found`,
        code: HttpStatus.NOT_FOUND,
      });
    }

    return attendance;
  }

  async update(
    id: number,
    updateData: UpdatePaymentMethodRequestDto,
  ): Promise<PaymentMethodResponseDto | null> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id: id },
    });
    if (!attendance) {
      this.logger.error(`PaymentMethod with ID ${id} not found for update`);
      throw new RpcException({
        message: `PaymentMethod with ID ${id} not found`,
        code: HttpStatus.NOT_FOUND,
      });
    }

    this.attendanceRepository.merge(attendance, updateData);
    return await this.attendanceRepository.save(attendance);
  }

  async remove(id: number): Promise<PaymentMethodResponseDto | null> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id: id },
    });
    if (!attendance) {
      this.logger.error(`PaymentMethod with ID ${id} not found for deletion`);
      throw new RpcException({
        message: `PaymentMethod with ID ${id} not found`,
        code: HttpStatus.NOT_FOUND,
      });
    }

    await this.attendanceRepository.remove(attendance);
    return attendance;
  }
}

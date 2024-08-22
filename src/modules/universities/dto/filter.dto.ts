import { BaseFilterDto } from '@/bases/filters/base-filter.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderType } from '@/bases/constants/order';
import { University } from '@/database/universities/university.entity';

class Order {
  @ApiPropertyOptional({ enum: OrderType, name: 'order[name]' })
  @IsEnum(OrderType)
  name?: OrderType;
}

export class FilterUniversityDto extends BaseFilterDto<University> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  order?: Order;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly name?: string = '';
}

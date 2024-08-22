import { BaseFilterDto } from '@/bases/filters/base-filter.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderType } from '@/bases/constants/order';
import { Document } from '@/database/entity';

class Order {}

export class FilterDocumentDto extends BaseFilterDto<Document> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  order?: Order;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly title?: string = '';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly universityId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly courseId?: number;

  @ApiPropertyOptional({ enum: OrderType })
  @IsOptional()
  @IsEnum(OrderType)
  readonly mostRecent?: OrderType = OrderType.DESC;

  @ApiPropertyOptional({ enum: OrderType })
  @IsOptional()
  @IsEnum(OrderType)
  readonly mostLiked?: OrderType = OrderType.DESC;

  @ApiPropertyOptional({ enum: OrderType })
  @IsOptional()
  @IsEnum(OrderType)
  readonly alphabet?: OrderType = OrderType.ASC;
}

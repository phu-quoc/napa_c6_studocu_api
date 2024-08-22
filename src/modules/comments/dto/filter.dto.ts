import { BaseFilterDto } from '@/bases/filters/base-filter.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Document } from '@/database/entity';

class Order {}

export class FilterCommentDto extends BaseFilterDto<Document> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  order?: Order;
}

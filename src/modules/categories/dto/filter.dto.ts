import { BaseFilterDto } from '@/bases/filters/base-filter.dto';
import { Category } from '@/database/categories/category.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

class Order {}

export class FilterCategoryDto extends BaseFilterDto<Category> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  order?: Order;
}

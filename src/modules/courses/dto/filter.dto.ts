import { BaseFilterDto } from '@/bases/filters/base-filter.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { Course } from '@/database/entity';

class Order {}

export class FilterCourseDto extends BaseFilterDto<Course> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  order?: Order;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly name?: string = '';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly universitySlug?: string;
}

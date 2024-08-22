import { Controller, Get, Query } from '@nestjs/common';
import { CategoriesService } from '@/modules/categories/categories.service';
import { FilterCategoryDto } from '@/modules/categories/dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(@Query() dto: FilterCategoryDto) {
    return this.categoriesService.findAll(dto);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '@/database/entity';
import { Repository } from 'typeorm';
import { Pagination } from '@/bases/types';
import { FilterCategoryDto } from '@/modules/categories/dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(filter: FilterCategoryDto): Promise<Pagination<Category>> {
    const [data, total] = await this.categoryRepository.findAndCount();
    return {
      current: filter.page,
      pageSize: filter.limit,
      total: total,
      data,
    };
  }

  findById(id: number): Promise<Category> {
    return this.categoryRepository.findOneBy({ id });
  }
}

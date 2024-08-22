import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Pagination } from '@/bases/types';
import { University } from '@/database/entity';
import {
  CreateUniversityDto,
  FilterUniversityDto,
} from '@/modules/universities/dto';

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectRepository(University)
    private universityRepository: Repository<University>,
  ) {}

  create(dto: CreateUniversityDto): Promise<University> {
    const university = this.universityRepository.create(dto);
    return this.universityRepository.save(university);
  }

  async findAll(filter: FilterUniversityDto): Promise<Pagination<University>> {
    const [data, total] = await this.universityRepository.findAndCount({
      take: filter.limit,
      skip: filter.skip,
      order: filter.order,
      where: {
        name: ILike(`%${filter.name}%`),
      },
    });
    return {
      current: filter.page,
      pageSize: filter.limit,
      total,
      data,
    };
  }

  findById(id: number): Promise<University> {
    return this.universityRepository.findOneBy({ id });
  }
}

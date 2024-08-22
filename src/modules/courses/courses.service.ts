import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Course } from '@/database/entity';
import { Pagination } from '@/bases/types';
import { CreateCourseDto, FilterCourseDto } from '@/modules/courses/dto';
import { ResourceNotFoundException } from '@exceptions/resource-not-found.exception';
import { MessageName } from '@constants/message';
import { UniversitiesService } from '@/modules/universities/universities.service';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    private universitiesService: UniversitiesService,
  ) {}

  async create(dto: CreateCourseDto): Promise<Course> {
    const university = await this.universitiesService.findById(
      dto.universityId,
    );
    if (!university)
      throw new ResourceNotFoundException(MessageName.UNIVERSITY);
    const course = this.courseRepository.create(dto);
    return this.courseRepository.save(course);
  }

  async findAll(filter: FilterCourseDto): Promise<Pagination<Course>> {
    const [data, total] = await this.courseRepository.findAndCount({
      take: filter.limit,
      skip: filter.skip,
      order: filter.order,
      where: {
        university: { slug: filter.universitySlug },
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

  findById(id: number): Promise<Course> {
    return this.courseRepository.findOneBy({ id });
  }
}

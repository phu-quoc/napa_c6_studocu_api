import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Document } from '@/database/entity';
import { ResourceNotFoundException } from '@exceptions/resource-not-found.exception';
import { MessageName } from '@constants/message';
import {
  CreateDocumentDto,
  FilterDocumentDto,
  UpdateDocumentDto,
} from '@/modules/documents/dto';
import { CoursesService } from '@/modules/courses/courses.service';
import { CategoriesService } from '@/modules/categories/categories.service';
import { Pagination, RemoveResult } from '@/bases/types';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private coursesService: CoursesService,
    private categoriesService: CategoriesService,
  ) {}

  async create(userId: number, dto: CreateDocumentDto): Promise<Document> {
    const course = await this.coursesService.findById(dto.courseId);
    if (!course) throw new ResourceNotFoundException(MessageName.COURSE);

    const category = await this.categoriesService.findById(dto.categoryId);
    if (!category) throw new ResourceNotFoundException(MessageName.CATEGORY);

    const document = this.documentRepository.create({
      ...dto,
      uploadedBy: userId,
    });
    return this.documentRepository.save(document);
  }

  async findAll(filter: FilterDocumentDto): Promise<Pagination<Document>> {
    const queryBuilder = await this.documentRepository
      .createQueryBuilder('document')
      .leftJoin('document.users', 'users')
      .leftJoin('document.uploader', 'uploader')
      .leftJoin('document.course', 'course')
      .leftJoin('course.university', 'university')
      .where({
        title: ILike(`%${filter.title}%`),
      });

    if (filter.universityId) {
      queryBuilder.andWhere({
        course: {
          university: {
            id: filter.universityId,
          },
        },
      });
    }
    if (filter.courseId) {
      queryBuilder.andWhere({
        course: {
          id: filter.courseId,
        },
      });
    }

    queryBuilder
      .select([
        'document.id',
        'document.title',
        'document.slug',
        'document.categoryId',
        'document.academicYear',
        'document.description',
        'document.view',
        'uploader.id',
        'uploader.displayName',
        'course.id',
        'course.name',
        'university.id',
        'university.name',
      ])
      .skip(filter.skip)
      .take(filter.limit)
      .loadRelationCountAndMap('document.liked', 'document.users');
    if (filter.alphabet) {
      queryBuilder.orderBy('document.title', filter.alphabet);
    } else if (filter.mostLiked) {
      queryBuilder.orderBy('document.liked', filter.mostLiked);
    } else {
      queryBuilder.orderBy('document.createdAt', filter.mostRecent);
    }
    const [data, total] = await queryBuilder.getManyAndCount();
    return {
      current: filter.page,
      pageSize: filter.limit,
      total,
      data,
    };
  }

  async findBySlug(slug: string): Promise<Document> {
    const document = await this.documentRepository.findOne({
      relations: {
        uploader: { university: true },
        course: { university: true },
      },
      where: { slug },
      select: {
        uploader: { displayName: true, university: { name: true } },
        course: {
          slug: true,
          name: true,
          university: {
            slug: true,
            name: true,
          },
        },
      },
    });
    if (!document) {
      throw new ResourceNotFoundException(MessageName.DOCUMENT);
    }

    const updated = Object.assign(document, { view: document.view + 1 });
    return this.documentRepository.save(updated);
  }

  findById(id: number): Promise<Document> {
    return this.documentRepository.findOneBy({ id });
  }

  async update(
    slug: string,
    userId: number,
    dto: UpdateDocumentDto,
  ): Promise<Document> {
    const toUpdate = await this.documentRepository.findOneBy({ slug });
    if (!toUpdate) {
      throw new ResourceNotFoundException(MessageName.DOCUMENT);
    }
    if (toUpdate.uploadedBy !== userId) {
      throw new ForbiddenException();
    }
    const updated = Object.assign(toUpdate, dto);
    return this.documentRepository.save(updated);
  }

  async remove(slug: string, userId: number): Promise<RemoveResult> {
    const document = await this.findBySlug(slug);
    if (!document) {
      throw new ResourceNotFoundException(MessageName.DOCUMENT);
    }
    if (document.uploadedBy !== userId) {
      throw new ForbiddenException();
    }
    const removed = await this.documentRepository.softDelete({ slug });
    return {
      removed: removed.affected,
    };
  }
}

import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { Document, User } from '@/database/entity';
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
import { UsersService } from '@/modules/users/users.service';
import { upgradePremiumPeriod } from '@/utils/date';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private coursesService: CoursesService,
    private categoriesService: CategoriesService,
    private usersService: UsersService,
    private dataSource: DataSource,
  ) {}

  async create(userId: number, dto: CreateDocumentDto): Promise<Document> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const course = await this.coursesService.findById(dto.courseId);
      if (!course) throw new ResourceNotFoundException(MessageName.COURSE);

      const category = await this.categoriesService.findById(dto.categoryId);
      if (!category) throw new ResourceNotFoundException(MessageName.CATEGORY);

      const user = await this.usersService.findById(userId);
      if (!user) throw new ResourceNotFoundException(MessageName.USER);
      const premiumExpireAt = upgradePremiumPeriod(user?.premiumExpireAt);
      const updated = Object.assign(user, { premiumExpireAt });
      await queryRunner.manager.save(User, updated);
      const document = queryRunner.manager.create(Document, {
        ...dto,
        uploadedBy: userId,
      });
      const newDocument = await queryRunner.manager.save(document);
      await queryRunner.commitTransaction();
      return newDocument;
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
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
    const document = await this.documentRepository
      .createQueryBuilder('document')
      .leftJoin('document.users', 'users')
      .leftJoin('document.uploader', 'uploader')
      .leftJoin('uploader.university', 'userUniversity')
      .leftJoin('document.course', 'course')
      .leftJoin('course.university', 'university')
      .select([
        'document.id',
        'document.title',
        'document.slug',
        'document.categoryId',
        'document.academicYear',
        'document.description',
        'document.view',
        'document.path',
        'uploader.avatar',
        'uploader.displayName',
        'userUniversity.name',
        'course.id',
        'course.name',
        'university.id',
        'university.name',
      ])
      .where({
        slug,
      })
      .loadRelationCountAndMap('document.liked', 'document.users')
      .getOne();
    if (!document) {
      throw new ResourceNotFoundException(MessageName.DOCUMENT);
    }

    const updated = Object.assign(document, { view: document.view + 1 });
    return this.documentRepository.save(updated);
  }

  findById(id: number): Promise<Document> {
    return this.documentRepository.findOneBy({ id });
  }

  async findByUserId(
    userId: number,
    filter: FilterDocumentDto,
  ): Promise<Pagination<Document>> {
    const [data, total] = await this.documentRepository
      .createQueryBuilder('document')
      .leftJoin('document.uploader', 'uploader')
      .where({
        uploader: {
          id: userId,
        },
      })
      .skip(filter.skip)
      .take(filter.limit)
      .loadRelationCountAndMap('document.liked', 'document.users')
      .getManyAndCount();
    return {
      current: filter.page,
      pageSize: filter.limit,
      total,
      data,
    };
  }

  async getStatistics(userId: number) {
    return this.documentRepository
      .createQueryBuilder('document')
      .leftJoin('document.users', 'users')
      .leftJoin('document.comments', 'comments')
      .where({
        uploader: {
          id: userId,
        },
      })
      .select('count(document.id)', 'total')
      .addSelect('sum(document.view)', 'views')
      .addSelect('count(users.id)', 'liked')
      .addSelect('count(comments.comment)', 'comments')
      .getRawOne();
  }

  async like(userId: number, slug: string): Promise<Document> {
    const document = await this.documentRepository.findOne({
      relations: {
        users: true,
      },
      where: {
        slug,
      },
    });
    const likedUserIndex = document.users.findIndex((el) => el.id === userId);
    if (likedUserIndex === -1) {
      const user = await this.usersService.findById(userId);
      document.users.push(user);
    } else {
      delete document.users[likedUserIndex];
    }
    return this.documentRepository.save(document);
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

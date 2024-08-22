import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '@/database/entity';
import { DocumentsService } from '@/modules/documents/documents.service';
import { ResourceNotFoundException } from '@exceptions/resource-not-found.exception';
import { MessageName } from '@constants/message';
import { CreateCommentDto } from '@/modules/comments/dto';
import { Pagination, RemoveResult } from '@/bases/types';
import { FilterDocumentDto } from '@/modules/documents/dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private documentsService: DocumentsService,
  ) {}

  async create(userId: number, dto: CreateCommentDto): Promise<Comment> {
    const document = await this.documentsService.findById(dto.documentId);
    if (!document) throw new ResourceNotFoundException(MessageName.DOCUMENT);

    return this.commentRepository.save({ ...dto, userId });
  }

  findById(id: number): Promise<Comment> {
    return this.commentRepository.findOneBy({ id });
  }

  async findByDocumentSlug(
    slug: string,
    filter: FilterDocumentDto,
  ): Promise<Pagination<Comment>> {
    const [data, total] = await this.commentRepository.findAndCount({
      take: filter.limit,
      skip: filter.skip,
      order: filter.order,
      where: {
        document: {
          slug: slug,
        },
      },
    });
    return {
      current: filter.page,
      pageSize: filter.limit,
      total,
      data,
    };
  }

  async remove(id: number, userId: number): Promise<RemoveResult> {
    const comment = await this.findById(id);
    if (!comment) {
      throw new ResourceNotFoundException(MessageName.COMMENT);
    }
    if (comment.userId !== userId) {
      throw new ForbiddenException();
    }
    const removed = await this.commentRepository.softDelete(id);
    return {
      removed: removed.affected,
    };
  }
}

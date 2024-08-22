import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommentsService } from '@/modules/comments/comments.service';
import { Auth, User } from '@/bases/decorators';
import { UserPayload } from '@/bases/types';
import { CreateCommentDto, FilterCommentDto } from '@/modules/comments/dto';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiBearerAuth()
  @Auth()
  @Post()
  create(@User() user: UserPayload, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(user.id, dto);
  }

  @Get('document/:slug')
  findByDocumentSlug(
    @Param('slug') slug: string,
    @Query() dto: FilterCommentDto,
  ) {
    return this.commentsService.findByDocumentSlug(slug, dto);
  }

  @ApiBearerAuth()
  @Auth()
  @Delete(':id')
  remove(@Param('id') id: number, @User() user: UserPayload) {
    return this.commentsService.remove(id, user.id);
  }
}

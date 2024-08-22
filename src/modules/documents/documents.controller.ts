import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth, Premium, User } from '@/bases/decorators';
import { DocumentsService } from '@/modules/documents/documents.service';
import {
  CreateDocumentDto,
  FilterDocumentDto,
  UpdateDocumentDto,
} from '@/modules/documents/dto';
import { UserPayload } from '@/bases/types';

@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @ApiBearerAuth()
  @Auth()
  @Post()
  create(@User() user: UserPayload, @Body() dto: CreateDocumentDto) {
    return this.documentsService.create(user.id, dto);
  }

  @Get()
  findAll(@Query() dto: FilterDocumentDto) {
    return this.documentsService.findAll(dto);
  }

  @ApiBearerAuth()
  @Auth()
  @Premium()
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.documentsService.findBySlug(slug);
  }

  @ApiBearerAuth()
  @Auth()
  @Patch(':slug')
  update(
    @Param('slug') slug: string,
    @User() user: UserPayload,
    @Body() dto: UpdateDocumentDto,
  ) {
    return this.documentsService.update(slug, user.id, dto);
  }

  @ApiBearerAuth()
  @Auth()
  @Delete(':slug')
  remove(@Param('slug') slug: string, @User() user: UserPayload) {
    return this.documentsService.remove(slug, user.id);
  }
}

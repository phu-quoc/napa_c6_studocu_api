import { PartialType } from '@nestjs/swagger';
import { CreateDocumentDto } from '@/modules/documents/dto/create.dto';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {}

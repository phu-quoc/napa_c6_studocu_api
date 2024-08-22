import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '@/database/entity';
import { DocumentsModule } from '@/modules/documents/documents.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), DocumentsModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}

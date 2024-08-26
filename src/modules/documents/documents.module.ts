import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '@/database/entity';
import { CoursesModule } from '@/modules/courses/courses.module';
import { CategoriesModule } from '@/modules/categories/categories.module';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document]),
    CoursesModule,
    CategoriesModule,
    UsersModule,
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}

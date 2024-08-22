import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course, University } from '@/database/entity';
import { UniversitiesModule } from '@/modules/universities/universities.module';

@Module({
  imports: [TypeOrmModule.forFeature([Course, University]), UniversitiesModule],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}

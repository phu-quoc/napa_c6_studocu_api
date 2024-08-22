import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CoursesService } from '@/modules/courses/courses.service';
import { Auth } from '@/bases/decorators';
import { CreateCourseDto, FilterCourseDto } from '@/modules/courses/dto';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiBearerAuth()
  @Auth()
  @Post()
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Get()
  findAll(@Query() dto: FilterCourseDto) {
    return this.coursesService.findAll(dto);
  }
}

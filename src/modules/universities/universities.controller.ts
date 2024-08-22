import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UniversitiesService } from '@/modules/universities/universities.service';
import { Auth } from '@/bases/decorators';
import {
  CreateUniversityDto,
  FilterUniversityDto,
} from '@/modules/universities/dto';

@ApiTags('universities')
@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @ApiBearerAuth()
  @Auth()
  @Post()
  create(@Body() dto: CreateUniversityDto) {
    return this.universitiesService.create(dto);
  }

  @Get()
  findAll(@Query() dto: FilterUniversityDto) {
    return this.universitiesService.findAll(dto);
  }
}

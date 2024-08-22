import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { University, User } from '@/database/entity';
import { UniversitiesService } from '@/modules/universities/universities.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, University])],
  providers: [UsersService, UniversitiesService],
  exports: [UsersService],
})
export class UsersModule {}

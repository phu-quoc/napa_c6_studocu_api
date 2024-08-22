import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty()
  @IsNumber()
  universityId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

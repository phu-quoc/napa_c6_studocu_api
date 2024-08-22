import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsNumber()
  documentId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  comment: string;
}

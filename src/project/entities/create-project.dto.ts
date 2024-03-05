import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Home Tasks', description: 'Title of project' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Tasks to do at home',
    description: 'Description of project',
  })
  @IsString()
  @IsOptional()
  description: string;
}

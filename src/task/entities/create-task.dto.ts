import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Clean window', description: 'Title of task' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Clean the window with steamgenerator',
    description: 'Description of task',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from './task.model';

export class UpdateTaskDto {
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

  @ApiProperty({
    example: TaskStatus.NEW,
    description: 'Status of task',
    type: String,
    enum: [TaskStatus.NEW, TaskStatus.IN_PROGRESS, TaskStatus.DONE],
  })
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: string;
}

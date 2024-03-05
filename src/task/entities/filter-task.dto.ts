import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from './task.model';

export enum SortVariants {
  STATUS = 'status',
  PROJECT_ID = 'projectId',
  CREATED_AT = 'createdAt',
}

export enum SortOrderVariant {
  ASC = 'asc',
  DESC = 'desc',
}

export class FilterTaskDto {
  @ApiProperty({
    example: 'sometext',
    description: 'Search string',
    required: false,
  })
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @ApiProperty({
    example: TaskStatus.NEW,
    description: 'Status of task',
    type: String,
    enum: TaskStatus,
    required: false,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: '65e50ce3eedb188ca1e3b558',
    description: 'projectId',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  projectId?: string;

  @ApiProperty({
    example: '65e50ce3eedb188ca1e3b558',
    description: 'createdBy (user id)',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  createdBy?: string;

  @ApiProperty({
    example: SortVariants.STATUS,
    description: 'Sort by field',
    type: String,
    enum: SortVariants,
    required: false,
  })
  @IsEnum(SortVariants)
  @IsOptional()
  sortBy?: SortVariants;

  @ApiProperty({
    example: SortOrderVariant.ASC,
    description: 'Sort direction',
    type: String,
    enum: SortOrderVariant,
    required: false,
  })
  @IsEnum(SortOrderVariant)
  @IsOptional()
  sortOrder?: SortOrderVariant;
}

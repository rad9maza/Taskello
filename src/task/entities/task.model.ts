import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MSchema } from 'mongoose';
import { User } from '../../users/entities/user.model';
import { Project } from '../../project/entities/project.model';

export type TaskDocument = Task & Document;

export enum TaskStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

@Schema({ timestamps: true })
export class Task {
  @ApiProperty({ example: 'Clean window', description: 'Title of task' })
  @Prop({
    required: true,
    type: String,
  })
  title: string;

  @ApiProperty({
    example: 'Clean the window with steamgenerator',
    description: 'Description of task',
  })
  @Prop({
    type: String,
  })
  description: string;

  @Prop({
    type: MSchema.Types.ObjectId,
    ref: User.name,
  })
  createdBy: User;

  @ApiProperty({
    example: '65e50ce3eedb188ca1e3b558',
    description: 'Id of project',
  })
  @Prop({
    type: MSchema.Types.ObjectId,
    ref: 'Project',
  })
  projectId: () => Project;

  @ApiProperty({
    example: TaskStatus.NEW,
    description: 'Status of task',
    type: String,
    enum: [TaskStatus.NEW, TaskStatus.IN_PROGRESS, TaskStatus.DONE],
  })
  @Prop({
    type: String,
    enum: TaskStatus,
    default: TaskStatus.NEW,
  })
  status: string;
}

export const TaskModel = SchemaFactory.createForClass(Task);

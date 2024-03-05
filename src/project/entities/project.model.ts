import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MSchema } from 'mongoose';
import { User } from '../../users/entities/user.model';
import { Task } from '../../task/entities/task.model';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @ApiProperty({ example: 'Home Tasks', description: 'Title of project' })
  @Prop({
    required: true,
    type: String,
  })
  title: string;

  @ApiProperty({
    example: 'Tasks to do at home',
    description: 'Description of project',
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

  @Prop([{ type: MSchema.Types.ObjectId, ref: Task.name }])
  tasks?: Task[];
}

export const ProjectModel = SchemaFactory.createForClass(Project);

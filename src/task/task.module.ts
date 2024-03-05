import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Project, ProjectModel } from '../project/entities/project.model';
import { User, UserModel } from '../users/entities/user.model';
import { Task, TaskModel } from './entities/task.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserModel,
      },
      {
        name: Project.name,
        schema: ProjectModel,
      },
      {
        name: Task.name,
        schema: TaskModel,
      },
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { Project, ProjectDocument } from '../project/entities/project.model';
import { Task, TaskDocument, TaskStatus } from './entities/task.model';
import { CreateTaskDto } from './entities/create-task.dto';
import { UpdateTaskDto } from './entities/update-task.dto';
import { FilterTaskDto } from './entities/filter-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async create(
    createUserDto: CreateTaskDto,
    userId: string,
    projectId: string,
  ): Promise<Task> {
    return this.taskModel
      .create({
        createdBy: userId,
        projectId: projectId,
        ...createUserDto,
      })
      .then((task) => {
        return this.projectModel.findByIdAndUpdate(
          projectId,
          {
            $addToSet: { tasks: task._id },
          },
          { new: true },
        );
      });
  }

  async update(taskId: string, updateUserDto: UpdateTaskDto): Promise<Task> {
    const existingTask = await this.taskModel.findByIdAndUpdate(
      taskId,
      {
        title: updateUserDto.title,
        description: updateUserDto.description,
        status: updateUserDto.status,
      },
      { new: true },
    );

    if (!existingTask) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }
    return existingTask;
  }

  async updateStatus(taskId: string, status: TaskStatus): Promise<Task> {
    const existingTask = await this.taskModel
      .findByIdAndUpdate(taskId, { status }, { new: true })
      .exec();

    if (!existingTask) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }
    return existingTask;
  }

  async delete(taskId: string): Promise<Task> {
    const deletedTask = await this.taskModel
      .findByIdAndDelete(taskId)
      .then((task) => {
        if (task?._id) {
          this.projectModel.findByIdAndUpdate(
            task.projectId,
            {
              $pull: { tasks: task._id },
            },
            { new: true },
          );
        }
        return task;
      })
      .catch((err) => {
        console.log(err);
      });

    if (!deletedTask) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }
    return deletedTask;
  }

  async findOne(taskId: string): Promise<Task> {
    const taskData = await this.taskModel.findById(taskId).exec();
    if (!taskData) {
      throw new NotFoundException('Task not found!');
    }
    return taskData;
  }

  async findBy(options: FilterTaskDto): Promise<Task[]> {
    const filterOptions: Partial<FilterTaskDto> & {
      $or?: [{ title: RegExp }, { description: RegExp }];
    } = {};
    let sortField: string = 'createdAt';
    let sortOrder: SortOrder = 1;
    if (Object.keys(options)?.length > 0) {
      if (Object.keys(options).includes('status')) {
        filterOptions['status'] = options.status;
      }
      if (Object.keys(options).includes('projectId')) {
        filterOptions['projectId'] = options.projectId;
      }
      if (Object.keys(options).includes('createdBy')) {
        filterOptions['createdBy'] = options.createdBy;
      }
      if (Object.keys(options).includes('searchTerm')) {
        filterOptions['$or'] = [
          { title: new RegExp(options.searchTerm, 'i') },
          { description: new RegExp(options.searchTerm, 'i') },
        ];
      }
      if (Object.keys(options).includes('sortBy')) {
        switch (options['sortBy'].toLowerCase()) {
          case 'status':
            sortField = 'status';
            break;
          case 'projectid':
            sortField = 'projectId';
            break;
          case 'createdat':
            sortField = 'createdAt';
            break;
        }
        sortOrder = options?.['sortOrder'].toLowerCase() === 'desc' ? -1 : 1;
      }
    }
    const query = this.taskModel.find(filterOptions);
    query.sort({ [sortField]: sortOrder });

    const taskData = await query.exec();

    if (!taskData) {
      throw new NotFoundException('Task not found!');
    }
    return taskData;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './entities/project.model';
import { CreateProjectDto } from './entities/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async findAll(): Promise<Project[]> {
    const projectsData = await this.projectModel.find();
    if (!projectsData || projectsData.length == 0) {
      throw new NotFoundException('Projects data not found!');
    }
    return projectsData;
  }

  async findOne(projectId: string): Promise<Project> {
    const projectsData = await this.projectModel
      .findById(projectId)
      .populate('tasks');
    if (!projectsData) {
      throw new NotFoundException('Project not found!');
    }
    return projectsData;
  }

  async create(
    createUserDto: CreateProjectDto,
    userId: string,
  ): Promise<Project> {
    const newProject = new this.projectModel({
      createdBy: userId,
      ...createUserDto,
    });
    return await newProject.save();
  }
}

import { Response } from 'express';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './entities/create-project.dto';
import { CreateTaskDto } from '../task/entities/create-task.dto';
import { TaskService } from '../task/task.service';
import { FilterTaskDto } from '../task/entities/filter-task.dto';
import { Project } from './entities/project.model';
import { ValidateMongoId } from '../pipes/mongoid-validation.pipe';
import { Task } from '../task/entities/task.model';

@ApiTags('Project')
@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiOkResponse({ description: 'Successful search', type: [Project] })
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.projectService.findAll();
  }

  @Get(`:projectId`)
  @ApiOperation({ summary: 'Get project by id' })
  @ApiOkResponse({ description: 'Successful search', type: [Project] })
  @ApiBadRequestResponse({ description: 'Unsuccessful search' })
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('projectId', ValidateMongoId) projectId: string) {
    return this.projectService.findOne(projectId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new project' })
  @ApiCreatedResponse({
    description: 'Successful creation',
    type: Project,
  })
  @ApiBadRequestResponse({
    description: 'Unsuccessful creation (validation crash)',
  })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    return this.projectService.create(createProjectDto, req.user.userId);
  }

  @Post(':projectId/createTask')
  @ApiOperation({ summary: 'Create task under project' })
  @ApiCreatedResponse({
    description: 'Successful creation',
    type: Task,
  })
  @ApiBadRequestResponse({
    description: 'Unsuccessful creation (validation crash)',
  })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async createTask(
    @Res() response: Response,
    @Body() createTaskDto: CreateTaskDto,
    @Req() req,
    @Param('projectId', ValidateMongoId) projectId: string,
  ) {
    try {
      const newTask = await this.taskService.create(
        createTaskDto,
        req.user.userId,
        projectId,
      );
      return response.status(HttpStatus.CREATED).json({
        message: 'Task has been created successfully',
        newTask,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Task not created!',
        error: 'Bad Request',
      });
    }
  }

  @Get(':projectId/tasks')
  @ApiOperation({ summary: 'Get tasks by project id with filtration' })
  @ApiOkResponse({
    description: 'Successful search',
    type: Task,
  })
  @ApiBadRequestResponse({
    description: 'Bad query',
  })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async findTasksBy(
    @Query() filterTaskDto: FilterTaskDto,
    @Param('projectId', ValidateMongoId) projectId: string,
  ) {
    return this.taskService.findBy({ ...filterTaskDto, projectId });
  }
}

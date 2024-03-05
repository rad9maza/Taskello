import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseEnumPipe,
  Patch,
  Put,
  Query,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
} from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { TaskService } from './task.service';
import { UpdateTaskDto } from './entities/update-task.dto';
import { FilterTaskDto } from './entities/filter-task.dto';
import { ValidateMongoId } from '../pipes/mongoid-validation.pipe';
import { Task, TaskStatus } from './entities/task.model';

@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get(`:taskId`)
  @ApiOperation({ summary: 'Get task by id' })
  @ApiOkResponse({
    description: 'Successful search',
    type: Task,
  })
  @ApiBadRequestResponse({
    description: 'Bad query',
  })
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('taskId', ValidateMongoId) taskId: string) {
    return this.taskService.findOne(taskId);
  }

  @Put('/:taskId')
  @ApiOperation({ summary: 'Update task by id' })
  @ApiOkResponse({
    description: 'Successful updated task by id',
    type: Task,
  })
  @ApiBadRequestResponse({
    description: 'Bad query',
  })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async update(
    @Res() response: Response,
    @Body() updateTaskDto: UpdateTaskDto,
    @Param('taskId', ValidateMongoId) taskId: string,
  ) {
    try {
      const existingTask = await this.taskService.update(taskId, updateTaskDto);
      return response.status(HttpStatus.OK).json(existingTask);
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete task by id' })
  @ApiOkResponse({
    description: 'Successful delete task by id',
    type: Task,
  })
  @ApiBadRequestResponse({
    description: 'Bad query',
  })
  @UseGuards(AuthGuard('jwt'))
  async delete(
    @Res() response: Response,
    @Param('id', ValidateMongoId) taskId: string,
  ) {
    try {
      const deletedTask = await this.taskService.delete(taskId);
      return response.status(HttpStatus.OK).json(deletedTask);
    } catch (err) {
      return response.status(err.status).json(err);
    }
  }

  @Patch(':id/:status')
  @ApiOperation({ summary: 'Set new status by id' })
  @ApiOkResponse({
    description: 'Successful change status',
    type: Task,
  })
  @ApiBadRequestResponse({
    description: 'Bad query',
  })
  @UseGuards(AuthGuard('jwt'))
  async updateStatus(
    @Res() response: Response,
    @Param('id', ValidateMongoId) taskId: string,
    @Param('status', new ParseEnumPipe(TaskStatus)) status: TaskStatus,
  ) {
    try {
      const deletedTask = await this.taskService.updateStatus(taskId, status);
      return response.status(HttpStatus.OK).json(deletedTask);
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get tasks with filtration' })
  @ApiOkResponse({
    description: 'Successful search',
    type: Task,
  })
  @ApiBadRequestResponse({
    description: 'Bad query',
  })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async findTasksBy(@Query() filterTaskDto: FilterTaskDto) {
    return this.taskService.findBy(filterTaskDto);
  }
}

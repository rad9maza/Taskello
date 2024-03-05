import { Response } from 'express';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TaskService } from './task.service';
import { Task } from './entities/task.model';
import { TaskController } from './task.controller';
import { mockTask } from './task.service.spec';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        TaskService,
        {
          provide: getModelToken('Task'),
          useValue: {},
        },
        {
          provide: getModelToken('Project'),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should findOne find task', async () => {
    jest
      .spyOn(service, 'findOne')
      .mockResolvedValue(mockTask() as unknown as Task);

    expect(await controller.findOne(mockTask()._id)).toEqual(mockTask());
  });

  it('should update task', async () => {
    jest
      .spyOn(service, 'update')
      .mockResolvedValue(mockTask() as unknown as Task);

    const response = {
      json: () => mockTask(),
      status: () => response,
    };
    const res = await controller.update(
      response as unknown as Response,
      mockTask() as unknown as Task,
      mockTask()._id,
    );

    expect(res).toEqual(mockTask());
    expect(service.update).toHaveBeenCalledWith(mockTask()._id, mockTask());
  });
});

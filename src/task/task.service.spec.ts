import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Query, Types } from 'mongoose';
import { Task, TaskStatus } from './entities/task.model';
import { createMock } from '@golevelup/ts-jest';
import {
  FilterTaskDto,
  SortOrderVariant,
  SortVariants,
} from './entities/filter-task.dto';

export const mockUser = (_id = '', username = 'user', password = 'pass') => ({
  _id,
  username,
  password,
});

export const mockProject = (
  _id = '65e62adf6899ad713a2c88b8',
  title = 'First project',
  description = 'desc of 1 project',
  createdBy = mockUser(),
  tasks = [],
) => ({
  _id,
  title,
  description,
  createdBy,
  tasks,
});

export const mockTask = (
  _id = '65e62f13eaf5adb02f895cdc',
  title = 'Task title',
  description = 'task description',
  projectId = mockProject()._id,
  createdBy = mockUser()._id,
) => ({
  _id,
  title,
  description,
  projectId,
  createdBy,
});

describe('TaskService', () => {
  let service: TaskService;
  let taskModel: Model<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getModelToken('Task'),
          useValue: {
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            findById: jest.fn(),
            find: jest.fn(),
            sort: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken('Project'),
          useValue: {
            findByIdAndUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskModel = module.get<Model<Task>>(getModelToken('Task'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should updateStatus task', async () => {
    const id = new Types.ObjectId().toHexString();
    const mockValue = mockTask(id);
    // jest
    //   .spyOn(taskModel, 'findByIdAndUpdate')
    //   .mockReturnValueOnce({ ...mockValue, status: TaskStatus.DONE } as any);

    jest.spyOn(taskModel, 'findByIdAndUpdate').mockReturnValueOnce(
      createMock<Query<Task, Task>>({
        exec: jest
          .fn()
          .mockResolvedValue({ ...mockValue, status: TaskStatus.DONE } as any),
      }),
    );

    const res = await service.updateStatus(id, TaskStatus.DONE);
    expect(res).toEqual({
      ...mockValue,
      status: TaskStatus.DONE,
    } as unknown as Task);
    expect(taskModel.findByIdAndUpdate).toHaveBeenCalledWith(
      id,
      { status: TaskStatus.DONE },
      { new: true },
    );
  });

  it('should findOne task', async () => {
    const id = new Types.ObjectId().toHexString();
    const mockValue = mockTask(id);
    jest.spyOn(taskModel, 'findById').mockReturnValueOnce(
      createMock<Query<Task, Task>>({
        exec: jest.fn().mockResolvedValue(mockValue),
      }),
    );

    const res = await service.findOne(id);
    expect(res).toBe(mockValue);
    expect(taskModel.findById).toHaveBeenCalledWith(id);
  });

  it('should findBy create correct query and sort obj', async () => {
    const id = new Types.ObjectId().toHexString();
    const mockValue = mockTask(id);
    const mockFilterOptions: FilterTaskDto = {
      searchTerm: '',
      status: TaskStatus.NEW,
      projectId: '',
      createdBy: mockUser()._id,
      sortBy: SortVariants.PROJECT_ID,
      sortOrder: SortOrderVariant.ASC,
    };
    const sort = jest.fn();
    jest.spyOn(taskModel, 'find').mockReturnValueOnce(
      createMock<Query<Task[], Task>>({
        exec: jest.fn().mockResolvedValue([mockValue]),
        sort: sort,
      }),
    );

    const res = await service.findBy(mockFilterOptions);

    expect(res).toEqual([mockValue]);
    expect(taskModel.find).toHaveBeenCalledWith({
      $or: [{ title: /(?:)/i }, { description: /(?:)/i }],
      createdBy: '',
      projectId: '',
      status: TaskStatus.NEW,
    });
    expect(sort).toHaveBeenCalledWith({
      projectId: 1,
    });
  });
});

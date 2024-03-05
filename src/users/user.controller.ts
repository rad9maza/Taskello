import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
} from '@nestjs/swagger/dist/decorators/api-response.decorator';

import { UserService } from './user.service';
import { CreateUserDto } from './entities/create-user.dto';
import { User } from './entities/user.model';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Registration of user' })
  @ApiOkResponse({
    description: 'Successful registration',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request (not uniq username)',
  })
  @UsePipes(new ValidationPipe())
  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.registerUser(createUserDto);
  }
}

import { Controller, Request, UseGuards, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';

import { AuthService } from './auth.service';
import { User } from '../users/entities/user.model';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Post(`/login`)
  @ApiOperation({ summary: 'Auth of user' })
  @ApiBody({ type: User })
  @ApiOkResponse({
    description: 'Successful auth',
    type: User,
  })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}

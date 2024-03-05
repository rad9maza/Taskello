import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'taskeruser', description: 'username' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'superpassword', description: 'password' })
  @IsString()
  password: string;
}

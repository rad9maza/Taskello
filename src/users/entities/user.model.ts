import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @ApiProperty({ example: 'taskeruser', description: 'username' })
  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  username: string;

  @ApiProperty({ example: 'superpassword', description: 'password' })
  @Prop({
    required: true,
  })
  password: string;
}

export const UserModel = SchemaFactory.createForClass(User);

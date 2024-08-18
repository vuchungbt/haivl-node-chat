import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { ArrayResponse, ObjectResponse } from '../definitions/httpResponse';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<ArrayResponse<User>> {
    const users = await this.userService.findAll();
    return {
      statusCode: 200,
      data: users,
    };
  }

  @Get(':username')
  async findOneByUsername(
    @Param('username') username: string,
  ): Promise<ObjectResponse<User>> {
    const user = await this.userService.findByUsername(username);
    if (user === null) {
      throw new BadRequestException('User not found');
    }
    return {
      statusCode: 200,
      data: user,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

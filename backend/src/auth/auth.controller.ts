import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ObjectResponse } from '../definitions/httpResponse';
import { User } from '../user/schemas/user.schema';
import { AuthService } from './auth.service';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ObjectResponse<User>> {
    const newUser = await this.authService.signup(createUserDto);
    return {
      statusCode: 200,
      data: newUser,
    };
  }
}

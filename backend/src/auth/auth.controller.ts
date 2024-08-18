import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ObjectResponse } from '../definitions/httpResponse';
import { User } from '../user/schemas/user.schema';
import { UserLoginDto } from './dto/user-login.dto';
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

  @Post('/login')
  async login(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<ObjectResponse<object>> {
    const accessTokenObject = await this.authService.login(userLoginDto);
    return {
      statusCode: 200,
      data: accessTokenObject,
    };
  }

  @Post('/forgotpassword')
  async forgotPassword(@Body('username') username: string) {
    await this.authService.passwordRequest(username);
    return {
      statusCode: 200,
    };
  }

  @Post('/createpassword/:username/token/:resetToken')
  async createPassword(
    @Param('username') username: string,
    @Param('resetToken') resetToken: string,
    @Body('password') password: string,
  ) {
    await this.authService.createPassword(username, password, resetToken);
    return {
      statusCode: 200,
    };
  }
}

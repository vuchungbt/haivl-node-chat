import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const user = await this.userService.findByUsername(createUserDto.username);
    if (user !== null) {
      throw new BadRequestException('User already exists');
    }
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    return await this.userService.create(createUserDto);
  }

  async login(userLoginDto: UserLoginDto): Promise<{ accessToken: string }> {
    const user = await this.userService.findByUsername(userLoginDto.username);
    if (await bcrypt.compare(userLoginDto.password, user.password)) {
      const payload = { sub: user.id, username: user.username };
      return {
        accessToken: await this.jwtService.signAsync(payload),
      };
    }
    throw new UnauthorizedException();
  }
}

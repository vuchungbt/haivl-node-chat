import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';

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

  async passwordRequest(username: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new NotFoundException();
    }
    const resetToken = uuidv4();
    user.resetToken = resetToken;
    user.resetTokenExpire = moment().add(1, 'hours').toDate();
    await this.userService.update(user.id, user);
    return resetToken;
  }

  async createPassword(username: string, password: string, resetToken: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new NotFoundException();
    }
    if (user.resetToken !== resetToken) {
      throw new BadRequestException();
    }
    const now = moment();
    const resetTokenExpire = moment(user.resetTokenExpire);
    if (now.diff(resetTokenExpire) > 0) {
      throw new BadRequestException();
    }
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = null;
    user.resetTokenExpire = null;
    await this.userService.update(user.id, user);
  }
}

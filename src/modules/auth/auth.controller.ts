import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../user/user.service';
import { ResponseUtilities } from 'src/utils/response.util';
import { COMMON_MESSAGE } from 'src/utils/message.enum';
import { LoginDto } from './dto/login.dto';

enum PATH {
  main = 'auth',
  login = 'login',
}
@Controller(PATH.main)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post(PATH.login)
  @UsePipes(new ValidationPipe())
  async login(@Body() body: LoginDto) {
    const user = (
      await this.userService.getUser({
        email: body?.email,
        isActive: true,
        isDeleted: false,
      })
    )?.toJSON();
    if (!user) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'User'),
        404,
      );
    }

    const passwordMatch = await this.authService.comparePassword(
      body?.password,
      user.password,
    );
    if (!passwordMatch) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.InvalidPassword,
        404,
      );
    }

    const {
      password,
      //   passwordExpireAt,
      deletedAt,
      updatedBy,
      deletedBy,
      createdBy,
      isActive,
      isDeleted,
      //   loginWithOtp,
      //   defaultPassword,
      ...rest
    } = user;

    const token = this.authService.generateToken(rest);

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      { token },
    );
  }
}

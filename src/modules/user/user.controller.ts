import {
  Body,
  Controller,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from './user.schema';
import { UsersService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { ResponseUtilities } from 'src/utils/response.util';
import { COMMON_MESSAGE } from 'src/utils/message.enum';
import { CreateUserDto } from './dto/createUser.dto';
import { EditUserDto } from './dto/editUser.dto';

enum PATH {
  main = 'user',
  create = 'create',
  list = 'list',
  edit = 'edit/:id',
  delete = 'delete/:id',
}

@Controller(PATH.main)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post(PATH.create)
  @UsePipes(new ValidationPipe())
  async createUser(@Body() userData: CreateUserDto) {
    const oldUser = await this.userService.getUser({
      email: userData.email,
      isActive: true,
      isDeleted: false,
    });
    if (oldUser) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.AlreadyExist.replace('{param}', 'Email'),
        400,
      );
    }

    const plainPassword = userData.password;
    const hashPassword = await this.authService.hashPassword(
      plainPassword ?? '',
    );
    userData.password = hashPassword;
    const data = await this.userService.createUser(userData);
    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      data,
    );
  }

  @Post(PATH.list)
  async getUsers() {
    const usersList = await this.userService.listUsers();
    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      usersList,
    );
  }

  @Post(PATH.edit)
  @UsePipes(new ValidationPipe())
  async editUser(@Param('id') id: string, @Body() editUser: EditUserDto) {
    const updateUser = await this.userService.editUser(id, editUser);
    if (!updateUser) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'User'),
        404,
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      updateUser,
    );
  }

  @Post(PATH.delete)
  async deleteUser(@Param('id') id: string) {
    const deleteUser = await this.userService.deleteUser(id);
    if (!deleteUser) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'User'),
        404,
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      deleteUser,
    );
  }
}

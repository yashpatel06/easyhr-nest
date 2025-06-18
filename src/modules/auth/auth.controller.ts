import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../user/user.service';
import { ResponseUtilities } from 'src/utils/response.util';
import { COMMON_MESSAGE } from 'src/utils/message.enum';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { extractRequestParams } from 'src/utils/helpers';
import mongoose from 'mongoose';
import { COLLECTIONS } from 'src/utils/common';

enum PATH {
  main = 'auth',
  login = 'login',
  currentUser = 'current-user',
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

  @UseGuards(AuthGuard)
  @Post(PATH.currentUser)
  async currentUser(@Request() req) {
    const { authToken, user } = extractRequestParams(req);

    const data = await this.userService.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(String(user?._id)),
        },
      },
      {
        $lookup: {
          from: COLLECTIONS.RoleMaster,
          localField: 'roleId',
          foreignField: '_id',
          as: 'role',
        },
      },
      {
        $lookup: {
          from: COLLECTIONS.Department,
          localField: 'departmentId',
          foreignField: '_id',
          as: 'department',
        },
      },
      {
        $lookup: {
          from: COLLECTIONS.Designation,
          localField: 'designationId',
          foreignField: '_id',
          as: 'designation',
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          contactNo: 1,
          role: { $arrayElemAt: ['$role.name', 0] },
          department: { $arrayElemAt: ['$department.name', 0] },
          designation: { $arrayElemAt: ['$designation.name', 0] },
        },
      },
    ]);

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      data,
    );
  }
}

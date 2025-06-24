import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { AuthGuard } from 'src/guards/auth.guard';
import { ListFilterDto } from 'src/utils/listFilter.dto';
import mongoose, { FilterQuery } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { UploadInterceptor } from 'src/utils/upload.util';
import { COLLECTIONS, EUserType } from 'src/utils/common';
import { CompanyService } from '../company/company.service';

enum PATH {
  main = 'user',
  create = 'create',
  list = 'list',
  details = 'details/:id',
  edit = 'edit/:id',
  delete = 'delete/:id',
  changeStatus = 'change-status/:id',
}

@UseGuards(AuthGuard)
@Controller(PATH.main)
export class UsersController {
  constructor(
    private userService: UsersService,
    private companyService: CompanyService,
    private authService: AuthService,
  ) {}

  @Post(PATH.create)
  @UsePipes(new ValidationPipe())
  // @UseInterceptors(UploadInterceptor('profilePicture', 'uploads'))
  async createUser(
    // @UploadedFile() file: Express.Multer.File,
    @Body() userData: CreateUserDto,
    @Request() req,
  ) {
    const user = req?.user;
    const companyId = user?.companyId;
    const oldUser = await this.userService.getUser({
      email: userData.email,
      // isActive: true,
      isDeleted: false,
    });
    if (oldUser) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.AlreadyExist.replace('{param}', 'Email'),
        400,
      );
    }

    const companyData = await this.companyService.getCompany({
      _id: new mongoose.Types.ObjectId(companyId),
    });

    let employeeId;
    if (companyData) {
      const count = await this.userService.countDocuments({
        companyId: new mongoose.Types.ObjectId(companyId),
      });
      const nextNumber = (count + 1).toString().padStart(3, '0'); // e.g., 005
      employeeId = `${companyData?.companyCode}-${nextNumber}`; // e.g., GOO-005
    }

    const plainPassword = userData.password;
    const hashPassword = await this.authService.hashPassword(
      plainPassword ?? '',
    );
    userData.password = hashPassword;
    userData.createdBy = user?._id;
    userData.companyId = companyId;
    userData.employeeId = employeeId;

    if (userData?.userType === EUserType.Client) {
      userData.userType = EUserType.Client;
    }
    // userData.profilePicture = file?.path;
    const data = await this.userService.createUser(userData);
    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      data,
    );
  }

  @Post(PATH.list)
  async getUsers(@Body() body: ListFilterDto, @Request() req) {
    const user = req?.user;
    const { currentPage, limit, search, sortOrder, sortParam } = body;
    const skip = ResponseUtilities.calculateSkip(currentPage, limit);
    const match: FilterQuery<User> = {
      isDeleted: false,
    };

    if (user?.userType === EUserType.Client) {
      match.companyId = new mongoose.Types.ObjectId(user?.companyId);
    }
    if (search && search !== '') {
      const searchQuery = { $regex: search, $options: 'i' };
      match['$or'] = [{ name: searchQuery }];
    }

    const result = await this.userService.aggregate([
      {
        $match: match,
      },
      {
        $lookup: {
          from: COLLECTIONS.RoleMaster,
          localField: 'roleId',
          foreignField: '_id',
          as: 'role',
          pipeline: [
            { $match: { isActive: true, isDeleted: false } },
            { $project: { name: 1, dispalyName: 1 } },
          ],
        },
      },
      {
        $lookup: {
          from: COLLECTIONS.Department,
          localField: 'departmentId',
          foreignField: '_id',
          as: 'department',
          pipeline: [
            { $match: { isActive: true, isDeleted: false } },
            { $project: { name: 1, dispalyName: 1 } },
          ],
        },
      },
      {
        $lookup: {
          from: COLLECTIONS.Designation,
          localField: 'designationId',
          foreignField: '_id',
          as: 'designation',
          pipeline: [
            { $match: { isActive: true, isDeleted: false } },
            { $project: { name: 1, dispalyName: 1 } },
          ],
        },
      },
      {
        $addFields: {
          role: { $arrayElemAt: ['$role', 0] },
          department: { $arrayElemAt: ['$department', 0] },
          designation: { $arrayElemAt: ['$designation', 0] },
        },
      },
      { $sort: { [sortParam]: sortOrder } },
      ...ResponseUtilities.facetStage(skip, limit),
    ]);
    const data = ResponseUtilities.formatPaginatedResponse(
      result,
      currentPage,
      limit,
    );

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      data,
    );
  }

  @Post(PATH.edit)
  @UsePipes(new ValidationPipe())
  async editUser(
    @Param('id') id: string,
    @Body() editUser: EditUserDto,
    @Request() req,
  ) {
    const user = req?.user;
    editUser.updatedBy = user?._id;
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

  @Post(PATH.details)
  async detailsUser(@Param('id') id: string) {
    const [userData] = await this.userService.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: COLLECTIONS.RoleMaster,
          localField: 'roleId',
          foreignField: '_id',
          as: 'role',
          pipeline: [
            { $match: { isActive: true, isDeleted: false } },
            { $project: { name: 1, displayName: 1 } },
          ],
        },
      },
      {
        $lookup: {
          from: COLLECTIONS.Department,
          localField: 'departmentId',
          foreignField: '_id',
          as: 'department',
          pipeline: [
            { $match: { isActive: true, isDeleted: false } },
            { $project: { name: 1, displayName: 1 } },
          ],
        },
      },
      {
        $lookup: {
          from: COLLECTIONS.Designation,
          localField: 'designationId',
          foreignField: '_id',
          as: 'designation',
          pipeline: [
            { $match: { isActive: true, isDeleted: false } },
            { $project: { name: 1, displayName: 1 } },
          ],
        },
      },
      {
        $addFields: {
          role: { $arrayElemAt: ['$role', 0] },
          department: { $arrayElemAt: ['$department', 0] },
          designation: { $arrayElemAt: ['$designation', 0] },
        },
      },
    ]);
    if (!userData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Employee'),
        404,
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      userData,
    );
  }

  @Post(PATH.delete)
  async deleteUser(@Param('id') id: string, @Request() req) {
    const user = req?.user;
    const deleteUser = await this.userService.deleteUser(id, user);
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

  @Post(PATH.changeStatus)
  async changeStatusUser(
    @Param('id') id: string,
    @Body() data: any,
    @Request() req,
  ) {
    const user = req?.user;
    data.updatedBy = user?._id;

    const updateData = await this.userService.changeStatusUser(id, data);
    if (!updateData) {
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
      updateData,
    );
  }
}

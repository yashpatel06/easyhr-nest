import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { PermissionService } from './permission.service';
import { AuthService } from '../auth/auth.service';
import { ResponseUtilities } from 'src/utils/response.util';
import { COMMON_MESSAGE } from 'src/utils/message.enum';
import mongoose, { FilterQuery } from 'mongoose';
import { CreatePermissionDto } from './dto/createPermission.dto';
import { EditPermissionDto } from './dto/editPermission.dto';
import { ListFilterDto } from 'src/utils/listFilter.dto';
import { PermissionMaster } from './permission.schema';

enum PATH {
  main = 'permission',
  create = 'create',
  list = 'list',
  getAll = 'getall',
  details = 'details/:id',
  edit = 'edit/:id',
  delete = 'delete/:id',
  changeStatus = 'change-status/:id',
}

@UseGuards(AuthGuard)
@Controller(PATH.main)
export class PermissionController {
  constructor(
    private permissionService: PermissionService,
    private authService: AuthService,
  ) {}

  @Post(PATH.create)
  @UsePipes(new ValidationPipe())
  async createPermission(@Body() data: CreatePermissionDto, @Request() req) {
    const user = req?.user;
    const oldData = await this.permissionService.getPermission({
      name: data?.name,
      // isActive: true,
      isDeleted: false,
    });
    if (oldData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.AlreadyExist.replace('{param}', 'Permission'),
        400,
      );
    }

    data.createdBy = user?._id;
    const newData = await this.permissionService.createPermission(data);
    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      newData,
    );
  }

  @Post(PATH.list)
  async listPermission(@Body() body: ListFilterDto) {
    const { currentPage, limit, search, sortOrder, sortParam } = body;
    const skip = ResponseUtilities.calculateSkip(currentPage, limit);
    const match: FilterQuery<PermissionMaster> = {
      isDeleted: false,
    };

    if (search && search !== '') {
      const searchQuery = { $regex: search, $options: 'i' };
      match['$or'] = [{ name: searchQuery }, { displayName: searchQuery }];
    }

    const result = await this.permissionService.aggregate([
      {
        $match: match,
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

  @Post(PATH.getAll)
  async getAllPermission(@Request() req) {
    const user = req?.user;
    const allPermissions = await this.permissionService.getAllPermission({
      isActive: true,
      isDeleted: false,
      permissionType: { $in: [user?.userType] },
    });
    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      allPermissions,
    );
  }

  @Post(PATH.details)
  async detailsPermission(@Param('id') id: string) {
    const permissionData = await this.permissionService.getPermission({
      _id: new mongoose.Types.ObjectId(id),
      isActive: true,
      isDeleted: false,
    });
    if (!permissionData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Permission'),
        404,
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      permissionData,
    );
  }

  @Post(PATH.edit)
  @UsePipes(new ValidationPipe())
  async editPermission(
    @Param('id') id: string,
    @Body() editPermission: EditPermissionDto,
    @Request() req,
  ) {
    const user = req?.user;
    editPermission.updatedBy = user?._id;

    const updatePermission = await this.permissionService.editPermission(
      id,
      editPermission,
    );
    if (!updatePermission) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Permission'),
        404,
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      updatePermission,
    );
  }

  @Post(PATH.delete)
  async deletePermission(@Param('id') id: string, @Request() req) {
    const user = req?.user;
    const deletePermission = await this.permissionService.deletePermission(
      id,
      user,
    );
    if (!deletePermission) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Permission'),
        404,
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      deletePermission,
    );
  }

  @Post(PATH.changeStatus)
  async changeStatusPermission(
    @Param('id') id: string,
    @Body() data: any,
    @Request() req,
  ) {
    const user = req?.user;
    data.updatedBy = user?._id;

    const updateData = await this.permissionService.changeStatusPermission(
      id,
      data,
    );
    if (!updateData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Permission'),
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

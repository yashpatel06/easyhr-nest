import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { ResponseUtilities } from 'src/utils/response.util';
import { COMMON_MESSAGE } from 'src/utils/message.enum';
import { CreateRoleDto } from './dto/createRole.dto';
import { EditRoleDto } from './dto/editRole.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import mongoose from 'mongoose';
import { COLLECTIONS } from 'src/utils/common';

enum PATH {
  main = 'role',
  create = 'create',
  list = 'list',
  details = 'details/:id',
  edit = 'edit/:id',
  delete = 'delete/:id',
  changeStatus = 'change-status/:id',
}
@UseGuards(AuthGuard)
@Controller(PATH.main)
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post(PATH.create)
  @UsePipes(new ValidationPipe())
  async createRole(@Body() data: CreateRoleDto, @Request() req) {
    const user = req.user;
    const companyId = data?.companyId || user?.companyId;
    const oldData = await this.roleService.getRole({
      name: data?.name,
      companyId: { $ne: new mongoose.Types.ObjectId(companyId) },
      // isActive: true,
      isDeleted: false,
    });
    if (oldData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.AlreadyExist.replace('{param}', 'Role'),
        400,
      );
    }

    data.createdBy = user?._id;
    const roleData = await this.roleService.createRole(data);

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      roleData,
    );
  }

  @Post(PATH.list)
  async listRole() {
    const rolesList = await this.roleService.listRole();
    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      rolesList,
    );
  }

  @Post(PATH.details)
  async detailsRole(@Param('id') id: string) {
    const roleData = await this.roleService.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: COLLECTIONS.PermissionMaster,
          localField: 'permissionIds',
          foreignField: '_id',
          as: 'permissions',
          pipeline: [
            { $match: { isActive: true, isDeleted: false } },
            {
              $project: {
                name: 1,
                displayName: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          name: 1,
          displayName: 1,
          roleType: 1,
          isDefault: 1,
          permissions: '$permissions',
        },
      },
    ]);

    // const roleData = await this.roleService.getRole({
    //   _id: new mongoose.Types.ObjectId(id),
    //   // isActive: true,
    //   isDeleted: false,
    // });
    if (!roleData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Role'),
        404,
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      roleData,
    );
  }

  @Post(PATH.edit)
  @UsePipes(new ValidationPipe())
  async editRole(
    @Param('id') id: string,
    @Body() data: EditRoleDto,
    @Request() req,
  ) {
    const user = req.user;
    data.updatedBy = user?._id;
    const updateRole = await this.roleService.editRole(id, data);
    if (!updateRole) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Role'),
        404,
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      updateRole,
    );
  }

  @Post(PATH.delete)
  async deleteRole(@Param('id') id: string, @Request() req) {
    const user = req.user;
    const deleteRole = await this.roleService.deleteRole(id, user);
    if (!deleteRole) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Role'),
        404,
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      deleteRole,
    );
  }

  @Post(PATH.changeStatus)
  async changeStatusRole(
    @Param('id') id: string,
    @Body() data: any,
    @Request() req,
  ) {
    const user = req?.user;
    data.updatedBy = user?._id;

    const updateData = await this.roleService.changeStatusRole(id, data);
    if (!updateData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Role'),
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

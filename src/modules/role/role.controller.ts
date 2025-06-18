import {
  Body,
  Controller,
  Param,
  Post,
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

enum PATH {
  main = 'role',
  create = 'create',
  list = 'list',
  edit = 'edit/:id',
  delete = 'delete/:id',
}
@UseGuards(AuthGuard)
@Controller(PATH.main)
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post(PATH.create)
  @UsePipes(new ValidationPipe())
  async createRole(@Body() data: CreateRoleDto) {
    const oldData = await this.roleService.getRole({
      name: data?.name,
      isActive: true,
      isDeleted: false,
    });
    if (oldData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.AlreadyExist.replace('{param}', 'Role'),
        400,
      );
    }

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

  @Post(PATH.edit)
  @UsePipes(new ValidationPipe())
  async editRole(@Param('id') id: string, @Body() data: EditRoleDto) {
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
  async deleteRole(@Param('id') id: string) {
    const deleteRole = await this.roleService.deleteRole(id);
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
}

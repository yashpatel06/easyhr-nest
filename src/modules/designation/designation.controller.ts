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
import { DesignationService } from './designation.service';
import { CreateDesignationDto } from './dto/createDesignation.dto';
import { ResponseUtilities } from 'src/utils/response.util';
import { COMMON_MESSAGE } from 'src/utils/message.enum';
import { RoleService } from '../role/role.service';
import { DepartmentService } from '../department/department.service';
import mongoose from 'mongoose';
import { EditDesignationDto } from './dto/editDesignation.dto';
import { AuthGuard } from 'src/guards/auth.guard';

enum PATH {
  main = 'designation',
  create = 'create',
  list = 'list',
  edit = 'edit/:id',
  delete = 'delete/:id',
}
@UseGuards(AuthGuard)
@Controller(PATH.main)
export class DesignationContoller {
  constructor(
    private designationService: DesignationService,
    private roleService: RoleService,
    private departmentService: DepartmentService,
  ) {}

  @Post(PATH.create)
  @UsePipes(new ValidationPipe())
  async createDesignation(@Body() data: CreateDesignationDto, @Request() req) {
    const user = req?.user;
    const roleData = await this.roleService.getRole({
      _id: new mongoose.Types.ObjectId(data.roleId),
      isActive: true,
      isDeleted: false,
    });
    if (!roleData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Role'),
        404,
      );
    }

    const departmentData = await this.departmentService.getDepartment({
      _id: new mongoose.Types.ObjectId(data?.departmentId),
      isActive: true,
      isDeleted: false,
    });
    if (!departmentData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Department'),
        404,
      );
    }

    const oldDesignation = await this.designationService.getDesignation({
      name: data?.name,
      roleId: new mongoose.Types.ObjectId(data?.roleId),
      departmentId: new mongoose.Types.ObjectId(data?.departmentId),
      isActive: true,
      isDeleted: false,
    });
    if (oldDesignation) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.AlreadyExist.replace('{param}', 'Designation'),
        400,
      );
    }

    data.createdBy = user?._id;
    const newData = await this.designationService.createDesignation(data);
    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      newData,
    );
  }

  @Post(PATH.list)
  async listDesignation() {
    const designationList = await this.designationService.listDesignation();
    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      designationList,
    );
  }

  @Post(PATH.edit)
  @UsePipes(new ValidationPipe())
  async editDesignation(
    @Param('id') id: string,
    @Body() data: EditDesignationDto,
    @Request() req,
  ) {
    const user = req?.user;
    const roleData = await this.roleService.getRole({
      _id: new mongoose.Types.ObjectId(data?.roleId),
      isActive: true,
      isDeleted: false,
    });
    if (!roleData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Role'),
        404,
      );
    }

    const departmentData = await this.departmentService.getDepartment({
      _id: new mongoose.Types.ObjectId(data?.departmentId),
      isActive: true,
      isDeleted: false,
    });
    if (!departmentData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Department'),
        404,
      );
    }

    data.updatedBy = user?._id;
    const updateDesignation = await this.designationService.editDesignation(
      id,
      data,
    );
    if (!updateDesignation) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Designation'),
        404,
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      updateDesignation,
    );
  }

  @Post(PATH.delete)
  async deleteDesignation(@Param('id') id: string, @Request() req) {
    const user = req?.user;
    const deleteData = await this.designationService.deleteDesignation(
      id,
      user,
    );
    if (!deleteData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Designation'),
        404,
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      deleteData,
    );
  }
}

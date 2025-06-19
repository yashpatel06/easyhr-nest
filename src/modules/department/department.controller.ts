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
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/createDepartment.dto';
import { ResponseUtilities } from 'src/utils/response.util';
import { COMMON_MESSAGE } from 'src/utils/message.enum';
import { EditDepartmentDto } from './dto/editDepartment.dto';
import { AuthGuard } from 'src/guards/auth.guard';

enum PATH {
  main = 'department',
  create = 'create',
  list = 'list',
  edit = 'edit/:id',
  delete = 'delete/:id',
  changeStatus = 'change-status/:id',
}
@UseGuards(AuthGuard)
@Controller(PATH.main)
export class DepartmentContoller {
  constructor(private departmentService: DepartmentService) {}

  @Post(PATH.create)
  @UsePipes(new ValidationPipe())
  async createDepartmetn(@Body() data: CreateDepartmentDto, @Request() req) {
    const user = req?.user;
    const oldData = await this.departmentService.getDepartment({
      name: data?.name,
      // isActive: true,
      isDeleted: false,
    });
    if (oldData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.AlreadyExist.replace('{param}', 'Department'),
        400,
      );
    }

    data.createdBy = user?._id;
    const newData = await this.departmentService.createDepartment(data);

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      newData,
    );
  }

  @Post(PATH.list)
  async listDepartment() {
    const departmentList = await this.departmentService.listDepartment();
    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      departmentList,
    );
  }

  @Post(PATH.edit)
  async editDepartment(
    @Param('id') id: string,
    @Body() data: EditDepartmentDto,
    @Request() req,
  ) {
    const user = req?.user;
    data.updatedBy = user?._id;
    const updateDepartment = await this.departmentService.editDepartment(
      id,
      data,
    );
    if (!updateDepartment) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Department'),
        404,
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      updateDepartment,
    );
  }

  @Post(PATH.delete)
  async deleteDepartment(@Param('id') id: string, @Request() req) {
    const user = req?.user;
    const deleteData = await this.departmentService.deleteDepartment(id, user);
    if (!deleteData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Deparatment'),
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

  @Post(PATH.changeStatus)
  async changeStatusCompany(
    @Param('id') id: string,
    @Body() data: any,
    @Request() req,
  ) {
    const user = req?.user;
    data.updatedBy = user?._id;
    const updateData = await this.departmentService.changeStatusDepartment(
      id,
      data,
    );
    if (!updateData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Department'),
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

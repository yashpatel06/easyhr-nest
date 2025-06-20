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
import { AuthGuard } from 'src/guards/auth.guard';
import { CompanyService } from './company.service';
import { AuthService } from '../auth/auth.service';
import { CreateCompanyDto } from './dto/createCompany.dto';
import { ResponseUtilities } from 'src/utils/response.util';
import { COMMON_MESSAGE } from 'src/utils/message.enum';
import { EditCompanyDto } from './dto/editCompany.dto';
import mongoose, { FilterQuery } from 'mongoose';
import { RoleService } from '../role/role.service';
import { PermissionService } from '../permission/permission.service';
import { EUserType } from 'src/utils/common';
import { UsersService } from '../user/user.service';
import { ListFilterDto } from 'src/utils/listFilter.dto';
import { Company } from './company.schema';

enum PATH {
  main = 'company',
  create = 'create',
  list = 'list',
  details = 'details/:id',
  edit = 'edit/:id',
  delete = 'delete/:id',
  changeStatus = 'change-status/:id',
}

@UseGuards(AuthGuard)
@Controller(PATH.main)
export class CompanyController {
  constructor(
    private companyService: CompanyService,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post(PATH.create)
  @UsePipes(new ValidationPipe())
  async createCompany(@Body() data: CreateCompanyDto, @Request() req) {
    const user = req?.user;

    const oldCompany = await this.companyService.getCompany({
      email: data?.email,
      isActive: true,
      isDeleted: false,
    });
    if (oldCompany) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.AlreadyExist.replace('{param}', 'Email'),
        400,
      );
    }

    data.createdBy = user?._id;
    const newData = await this.companyService.createCompany(data);
    if (!newData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.Error,
        500,
      );
    }

    const permissions = await this.permissionService.getAllPermission();
    const permissionIds = permissions?.map((e) => e?._id.toString());

    const creatRole = await this.roleService.createRole({
      name: 'Client Admin',
      displayName: 'Client Admin',
      roleType: EUserType.Client,
      isDefault: true,
      permissionIds: permissionIds,
      companyId: newData._id.toString(),
      createdBy: user?._id,
    });
    if (!creatRole) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.Error,
        500,
      );
    }

    const password = await this.authService.hashPassword('123456');
    const createUser = await this.userService.createUser({
      name: newData.ownerName,
      email: newData.email,
      password: password,
      contactNo: newData.contactNo,
      alternateContactNo: newData.alternateContactNo,
      roleId: creatRole._id.toString(),
      companyId: newData._id.toString(),
      createdBy: user?._id,
    });
    if (!createUser) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.Error,
        500,
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      newData,
    );
  }

  @Post(PATH.list)
  async listCompany(@Body() body: ListFilterDto) {
    const { currentPage, limit, search, sortOrder, sortParam } = body;
    const skip = ResponseUtilities.calculateSkip(currentPage, limit);
    const match: FilterQuery<Company> = {
      isDeleted: false,
    };

    if (search && search !== '') {
      const searchQuery = { $regex: search, $options: 'i' };
      match['$or'] = [{ name: searchQuery }, { displayName: searchQuery }];
    }

    const result = await this.companyService.aggregate([
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

  @Post(PATH.details)
  async detailsCompany(@Param('id') id: string) {
    const companyData = await this.companyService.getCompany({
      _id: new mongoose.Types.ObjectId(id),
      // isActive: true,
      isDeleted: false,
    });
    if (!companyData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Company'),
        404,
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      companyData,
    );
  }

  @Post(PATH.edit)
  @UsePipes(new ValidationPipe())
  async editCompany(
    @Param('id') id: string,
    @Body() editCompany: EditCompanyDto,
    @Request() req,
  ) {
    const user = req?.user;
    editCompany.updatedBy = user?._id;

    const updateCompany = await this.companyService.editCompany(
      id,
      editCompany,
    );
    if (!updateCompany) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Company'),
        404,
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      updateCompany,
    );
  }

  @Post(PATH.delete)
  async deleteCompany(@Param('id') id: string, @Request() req) {
    const user = req?.user;
    const deleteCompany = await this.companyService.deleteCompany(id, user);
    if (!deleteCompany) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Company'),
        404,
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      deleteCompany,
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
    const updateData = await this.companyService.changeStatusCompany(id, data);
    if (!updateData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Company'),
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

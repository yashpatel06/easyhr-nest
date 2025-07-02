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
import { CompanyLeaveTypeService } from './companyLeaveType.service';
import { CreateCompanyLeaveTypeDto } from './dto/createCompanyLeaveType';
import mongoose, { FilterQuery } from 'mongoose';
import { ResponseUtilities } from 'src/utils/response.util';
import { COMMON_MESSAGE } from 'src/utils/message.enum';
import { ListFilterDto } from 'src/utils/listFilter.dto';
import { CompanyLeaveType } from './companyLeaveType.schema';
import { EUserType } from 'src/utils/common';
import { EditCompanyLeaveTypeDto } from './dto/editCompanyLeaveType';

enum PATH {
  main = 'company-leave-type',
  create = 'create',
  list = 'list',
  details = 'details/:id',
  edit = 'edit/:id',
  delete = 'delete/:id',
  changeStatus = 'change-status/:id',
  dropdown = 'dropdown',
}

@UseGuards(AuthGuard)
@Controller(PATH.main)
export class CompanyLeaveTypeController {
  constructor(private companyLeaveTypeService: CompanyLeaveTypeService) {}

  @Post(PATH.create)
  @UsePipes(new ValidationPipe())
  async createCompanyLeaveType(
    @Body() data: CreateCompanyLeaveTypeDto,
    @Request() req,
  ) {
    const user = req?.user;

    const oldData = await this.companyLeaveTypeService.getCompanyLeaveType({
      name: data?.name,
      companyId: { $eq: new mongoose.Types.ObjectId(user?.companyId) },
      // isActive: true,
      isDeleted: false,
    });
    if (oldData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.AlreadyExist.replace('{param}', 'Company Leave Type'),
        400,
      );
    }

    data.createdBy = user?._id;
    const leaveTypeData =
      await this.companyLeaveTypeService.createCompanyLeaveType(data);

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      leaveTypeData,
    );
  }

  @Post(PATH.list)
  async listCompanyLeaveType(@Body() body: ListFilterDto, @Request() req) {
    const user = req?.user;
    const { currentPage, limit, search, sortOrder, sortParam, filters } = body;
    const skip = ResponseUtilities.calculateSkip(currentPage, limit);
    const match: FilterQuery<CompanyLeaveType> = {
      isDeleted: false,
    };

    if (user.userType === EUserType.Client) {
      match.companyId = new mongoose.Types.ObjectId(user?.companyId);
    }

    if (search && search !== '') {
      const searchQuery = { $regex: search, $options: 'i' };
      match['$or'] = [{ name: searchQuery }, { displayName: searchQuery }];
    }

    const result = await this.companyLeaveTypeService.aggregate([
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
  async detailsCompanyLeaveType(@Param('id') id: string) {
    const companyLeaveTypeData =
      await this.companyLeaveTypeService.getCompanyLeaveType({
        _id: new mongoose.Types.ObjectId(id),
      });
    if (!companyLeaveTypeData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Company Leave Type'),
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      companyLeaveTypeData,
    );
  }

  @Post(PATH.edit)
  @UsePipes(new ValidationPipe())
  async editCompanyLeaveType(
    @Param('id') id: string,
    @Body() data: EditCompanyLeaveTypeDto,
    @Request() req,
  ) {
    const user = req.user;
    data.updatedBy = user?._id;
    const updateData = await this.companyLeaveTypeService.editCompanyLeaveType(
      id,
      data,
    );
    if (!updateData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Company Leave Type'),
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

  @Post(PATH.delete)
  async deleteCompanyLeaveType(@Param('id') id: string, @Request() req) {
    const user = req.user;
    const deleteLeaveType =
      await this.companyLeaveTypeService.deleteCompanyLeaveType(id, user);
    if (!deleteLeaveType) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Company Leave Type'),
        404,
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      deleteLeaveType,
    );
  }

  @Post(PATH.changeStatus)
  async changeStatusCompanyLeaveType(
    @Param('id') id: string,
    @Body() data: any,
    @Request() req,
  ) {
    const user = req?.user;
    data.updatedBy = user?._id;

    const updateData =
      await this.companyLeaveTypeService.changeStatusCompanyLeaveType(id, data);
    if (!updateData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Leave Type'),
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

  @Post(PATH.dropdown)
  async dropdownCompanyLeaveType(@Request() req) {
    const allLeaveType =
      await this.companyLeaveTypeService.getAllCompanyLeaveType({
        isActive: true,
        isDeleted: false,
      });

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      allLeaveType,
    );
  }
}

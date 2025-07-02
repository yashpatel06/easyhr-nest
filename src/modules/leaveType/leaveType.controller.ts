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
import { LeaveTypeService } from './leaveType.service';
import { CreateLeaveTypeDto } from './dto/createLeaveType.dto';
import mongoose, { FilterQuery } from 'mongoose';
import { ResponseUtilities } from 'src/utils/response.util';
import { COMMON_MESSAGE } from 'src/utils/message.enum';
import { ListFilterDto } from 'src/utils/listFilter.dto';
import { LeaveType } from './leaveType.schema';
import { EUserType } from 'src/utils/common';
import { EditLeaveTypeDto } from './dto/editLeaveType.dto';

enum PATH {
  main = 'leave-type',
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
export class LeaveTypeController {
  constructor(private leaveTypeService: LeaveTypeService) {}

  @Post(PATH.create)
  @UsePipes(new ValidationPipe())
  async createLeaveType(@Body() data: CreateLeaveTypeDto, @Request() req) {
    const user = req.user;
    const companyId = user?.companyId;
    console.log('companyId', companyId);
    const oldData = await this.leaveTypeService.getLeaveType({
      name: data?.name,
      companyId: { $eq: new mongoose.Types.ObjectId(companyId) },
      // isActive: true,
      isDeleted: false,
    });
    console.log('oldData', oldData);
    if (oldData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.AlreadyExist.replace('{param}', 'Leave Type'),
        400,
      );
    }

    data.createdBy = user?._id;
    data.companyId = companyId;
    const leaveTypeData = await this.leaveTypeService.createLeaveType(data);

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      leaveTypeData,
    );
  }

  @Post(PATH.list)
  async listLeaveType(@Body() body: ListFilterDto, @Request() req) {
    const user = req?.user;
    const { currentPage, limit, search, sortOrder, sortParam } = body;
    const skip = ResponseUtilities.calculateSkip(currentPage, limit);
    const match: FilterQuery<LeaveType> = {
      isDeleted: false,
    };

    if (user.userType === EUserType.Client) {
      match.companyId = new mongoose.Types.ObjectId(user?.companyId);
    }

    if (search && search !== '') {
      const searchQuery = { $regex: search, $options: 'i' };
      match['$or'] = [{ name: searchQuery }, { displayName: searchQuery }];
    }

    const result = await this.leaveTypeService.aggregate([
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
  async detailsLeaveType(@Param('id') id: string) {
    const leaveTypeData = await this.leaveTypeService.getLeaveType({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (!leaveTypeData) {
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
      leaveTypeData,
    );
  }

  @Post(PATH.edit)
  @UsePipes(new ValidationPipe())
  async editLeaveType(
    @Param('id') id: string,
    @Body() data: EditLeaveTypeDto,
    @Request() req,
  ) {
    const user = req.user;
    data.updatedBy = user?._id;
    const updateData = await this.leaveTypeService.editLeaveType(id, data);
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

  @Post(PATH.delete)
  async deleteLeaveType(@Param('id') id: string, @Request() req) {
    const user = req.user;
    const deleteLeaveType = await this.leaveTypeService.deleteLeaveType(
      id,
      user,
    );
    if (!deleteLeaveType) {
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
      deleteLeaveType,
    );
  }

  @Post(PATH.changeStatus)
  async changeStatusLeaveType(
    @Param('id') id: string,
    @Body() data: any,
    @Request() req,
  ) {
    const user = req?.user;
    data.updatedBy = user?._id;

    const updateData = await this.leaveTypeService.changeStatusLeaveType(
      id,
      data,
    );
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
  async dropdownLeaveType(@Request() req) {
    const user = req?.user;
    const allLeaveType = await this.leaveTypeService.getAllLeaveType({
      companyId: new mongoose.Types.ObjectId(user?.companyId),
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

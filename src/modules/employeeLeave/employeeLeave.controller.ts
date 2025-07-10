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
import { EmployeeLeaveService } from './employeeLeave.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateEmployeeLeaveDto } from './dto/createEmployeeLeave.dto';
import { ResponseUtilities } from 'src/utils/response.util';
import { COMMON_MESSAGE } from 'src/utils/message.enum';
import mongoose, { FilterQuery } from 'mongoose';
import { EditEmployeeLeaveDto } from './dto/editEmployeeLeave.dto';
import { ListFilterDto } from 'src/utils/listFilter.dto';
import { EmployeeLeave } from './employeeLeave.schema';
import { COLLECTIONS, EUserType } from 'src/utils/common';
import { CompanyLeaveTypeService } from '../companyLeaveType/companyLeaveType.service';

enum PATH {
  main = 'employee-leave',
  create = 'create',
  list = 'list',
  edit = 'edit/:id',
  details = 'details/:id',
  delete = 'delete/:id',
  action = 'action/:id',
  allEmployeeList = 'all-employee/list',
}

@UseGuards(AuthGuard)
@Controller(PATH.main)
export class EmployeeLeaveController {
  constructor(
    private employeeLeaveService: EmployeeLeaveService,
    private companyLeaveTypeService: CompanyLeaveTypeService,
  ) {}

  @Post(PATH.create)
  @UsePipes(new ValidationPipe())
  async createEmployeeLeave(
    @Body() data: CreateEmployeeLeaveDto,
    @Request() req,
  ) {
    const user = req?.user;
    const companyId = user?.companyId;

    const leaveType = await this.companyLeaveTypeService.getCompanyLeaveType({
      _id: new mongoose.Types.ObjectId(data?.companyLeaveTypeId),
      isActive: true,
      isDeleted: false,
    });
    if (!leaveType) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Leave Type'),
        404,
      );
    }

    data.createdBy = user?._id;
    data.userId = user?._id;
    data.companyId = companyId;
    const newLeaveData =
      await this.employeeLeaveService.createEmployeeLeave(data);

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      newLeaveData,
    );
  }

  @Post(PATH.edit)
  @UsePipes(new ValidationPipe())
  async editEmployeeLeave(
    @Param('id') id: string,
    @Body() data: EditEmployeeLeaveDto,
    @Request() req,
  ) {
    const user = req?.user;
    data.updatedBy = user?._id;

    if (data?.companyLeaveTypeId) {
      const leaveType = await this.companyLeaveTypeService.getCompanyLeaveType({
        _id: new mongoose.Types.ObjectId(data?.companyLeaveTypeId),
        isActive: true,
        isDeleted: false,
      });
      if (!leaveType) {
        return ResponseUtilities.responseWrapper(
          false,
          COMMON_MESSAGE.NotFound.replace('{param}', 'Leave Type'),
          404,
        );
      }
    }

    const updateData = await this.employeeLeaveService.editEmployeeLeave(
      id,
      data,
    );
    if (!updateData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Employee Leave'),
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

  @Post(PATH.list)
  async listEmployeeLeave(@Body() body: ListFilterDto, @Request() req) {
    const user = req?.user;
    const { currentPage, limit, search, sortOrder, sortParam } = body;
    const skip = ResponseUtilities.calculateSkip(currentPage, limit);
    const match: FilterQuery<EmployeeLeave> = {
      isActive: true,
      isDeleted: false,
      userId: new mongoose.Types.ObjectId(user?._id),
      companyId: new mongoose.Types.ObjectId(user?.companyId),
    };

    if (user.userType === EUserType.Client) {
      match.companyId = new mongoose.Types.ObjectId(user?.companyId);
    }

    const result = await this.employeeLeaveService.aggregate([
      { $match: match },
      {
        $lookup: {
          from: COLLECTIONS.CompanyLeaveType,
          localField: 'companyLeaveTypeId',
          foreignField: '_id',
          as: 'leaveType',
          pipeline: [{ $project: { name: 1, displayName: 1 } }],
        },
      },
      {
        $lookup: {
          from: COLLECTIONS.User,
          localField: 'actionBy',
          foreignField: '_id',
          as: 'actionBy',
          pipeline: [{ $project: { firstName: 1, lastName: 1 } }],
        },
      },
      {
        $addFields: {
          leaveType: { $arrayElemAt: ['$leaveType', 0] },
          actionBy: { $arrayElemAt: ['$actionBy', 0] },
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

  @Post(PATH.details)
  async detailsEmployeeLeave(@Param('id') id: string) {
    const [leaveData] = await this.employeeLeaveService.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          isActive: true,
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: COLLECTIONS.CompanyLeaveType,
          localField: 'companyLeaveTypeId',
          foreignField: '_id',
          as: 'companyLeaveType',
          pipeline: [{ $project: { name: 1, displayName: 1 } }],
        },
      },
      {
        $lookup: {
          from: COLLECTIONS.User,
          localField: 'actionBy',
          foreignField: '_id',
          as: 'actionBy',
          pipeline: [{ $project: { firstName: 1, lastName: 1 } }],
        },
      },
      {
        $addFields: {
          leaveType: { $arrayElemAt: ['$companyLeaveType', 0] },
          actionBy: { $arrayElemAt: ['$actionBy', 0] },
        },
      },
    ]);
    if (!leaveData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Employee Leave'),
        404,
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      leaveData,
    );
  }

  @Post(PATH.delete)
  async deleteEmployeeLeave(@Param('id') id: string, @Request() req) {
    const user = req?.user;

    const deleteData = await this.employeeLeaveService.deleteEmployeeLeave(
      id,
      user,
    );
    if (!deleteData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Employee Leave'),
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

  @Post(PATH.action)
  async actionEmployeeLeave(
    @Param('id') id: string,
    @Body() body: any,
    @Request() req,
  ) {
    const user = req?.user;

    body.status = body?.action;
    body.actionBy = user?._id;

    const actionData = await this.employeeLeaveService.actionEmployeeLeave(
      id,
      body,
    );

    if (!actionData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Employee Leave'),
        404,
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      actionData,
    );
  }

  @Post(PATH.allEmployeeList)
  async listAllEmployeeLeave(@Body() body: ListFilterDto, @Request() req) {
    const user = req?.user;

    const { currentPage, limit, search, sortOrder, sortParam, filters } = body;
    const skip = ResponseUtilities.calculateSkip(currentPage, limit);

    const match: FilterQuery<any> = {
      isActive: true,
      isDeleted: false,
      companyId: new mongoose.Types.ObjectId(user?.companyId),
    };

    if (filters?.employeeId) {
      match.userId = new mongoose.Types.ObjectId(filters?.employeeId);
    }

    if (filters?.status) {
      match.status = filters?.status;
    }

    const result = await this.employeeLeaveService.aggregate([
      { $match: match },
      {
        $lookup: {
          from: COLLECTIONS.User,
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
          pipeline: [
            { $match: { isActive: true, isDeleted: false } },
            { $project: { firstName: 1, lastName: 1, reportingManager: 1 } },
          ],
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          'user.reportingManager': new mongoose.Types.ObjectId(user?._id),
        },
      },
      {
        $lookup: {
          from: COLLECTIONS.CompanyLeaveType,
          localField: 'companyLeaveTypeId',
          foreignField: '_id',
          as: 'leaveType',
          pipeline: [{ $project: { name: 1, displayName: 1 } }],
        },
      },
      { $unwind: { path: '$leaveType', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: COLLECTIONS.User,
          localField: 'actionBy',
          foreignField: '_id',
          as: 'actionBy',
          pipeline: [{ $project: { firstName: 1, lastName: 1 } }],
        },
      },
      { $unwind: { path: '$actionBy', preserveNullAndEmptyArrays: true } },
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
}

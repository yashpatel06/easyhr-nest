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
import mongoose, { FilterQuery } from 'mongoose';
import { EditDesignationDto } from './dto/editDesignation.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ListFilterDto } from 'src/utils/listFilter.dto';
import { Designation } from './designation.schema';
import { COLLECTIONS, EUserType } from 'src/utils/common';

enum PATH {
  main = 'designation',
  create = 'create',
  list = 'list',
  details = 'details/:id',
  edit = 'edit/:id',
  delete = 'delete/:id',
  changeStatus = 'change-status/:id',
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
      departmentId: new mongoose.Types.ObjectId(data?.departmentId),
      // isActive: true,
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
    data.companyId = user?.companyId;
    const newData = await this.designationService.createDesignation(data);
    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      newData,
    );
  }

  @Post(PATH.list)
  async listDesignation(@Body() body: ListFilterDto, @Request() req) {
    const user = req?.user;
    const { currentPage, limit, search, sortOrder, sortParam } = body;
    const skip = ResponseUtilities.calculateSkip(currentPage, limit);
    const match: FilterQuery<Designation> = {
      isDeleted: false,
    };

    if (user.userType === EUserType.Client) {
      match.companyId = new mongoose.Types.ObjectId(user?.companyId);
    }

    if (search && search !== '') {
      const searchQuery = { $regex: search, $options: 'i' };
      match['$or'] = [{ name: searchQuery }, { displayName: searchQuery }];
    }

    const result = await this.designationService.aggregate([
      {
        $match: match,
      },
      {
        $lookup: {
          from: COLLECTIONS.Department,
          localField: 'departmentId',
          foreignField: '_id',
          as: 'department',
          pipeline: [{ $match: { isActive: true, isDeleted: false } }],
        },
      },
      {
        $unwind: {
          path: '$department',
          preserveNullAndEmptyArrays: true,
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
  async detailsDesignation(@Param('id') id: string) {
    const [designationData] = await this.designationService.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
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
          dispalyName: 1,
          isActive: 1,
          departmentId: 1,
          department: { $arrayElemAt: ['$department', 0] },
        },
      },
    ]);
    if (!designationData) {
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
      designationData,
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

  @Post(PATH.changeStatus)
  async changeStatusDesignation(
    @Param('id') id: string,
    @Body() data: any,
    @Request() req,
  ) {
    const user = req?.user;
    data.updatedBy = user?._id;

    const updateData = await this.designationService.changeStatusDesignation(
      id,
      data,
    );
    if (!updateData) {
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
      updateData,
    );
  }
}

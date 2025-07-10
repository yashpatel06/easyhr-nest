import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage } from 'mongoose';
import { COLLECTIONS } from 'src/utils/common';
import { EmployeeLeave } from './employeeLeave.schema';
import { CreateEmployeeLeaveDto } from './dto/createEmployeeLeave.dto';
import { EditEmployeeLeaveDto } from './dto/editEmployeeLeave.dto';
import { ListFilterDto } from 'src/utils/listFilter.dto';
import { ResponseUtilities } from 'src/utils/response.util';

@Injectable()
export class EmployeeLeaveService {
  constructor(
    @InjectModel(COLLECTIONS.EmployeeLeave)
    private employeeLeaveModel: Model<EmployeeLeave>,
  ) {}

  async createEmployeeLeave(data: CreateEmployeeLeaveDto) {
    const newLeave = new this.employeeLeaveModel(data);
    return newLeave.save();
  }

  async editEmployeeLeave(id: string, data: EditEmployeeLeaveDto) {
    return this.employeeLeaveModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteEmployeeLeave(id: string, user: any) {
    return this.employeeLeaveModel.findByIdAndUpdate(
      id,
      {
        $set: {
          isActive: false,
          isDeleted: true,
          deletedBy: user?._id,
          deletedAt: new Date(),
        },
      },
      { new: true },
    );
  }

  async actionEmployeeLeave(id: string, data: any) {
    return this.employeeLeaveModel.findByIdAndUpdate(id, data, { new: true });
  }

  async aggregate(pipeline: PipelineStage[]) {
    return this.employeeLeaveModel.aggregate(pipeline);
  }
}

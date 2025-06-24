import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import { COLLECTIONS } from 'src/utils/common';
import { LeaveType } from './leaveType.schema';
import { CreateLeaveTypeDto } from './dto/createLeaveType.dto';
import { EditLeaveTypeDto } from './dto/editLeaveType.dto';

@Injectable()
export class LeaveTypeService {
  constructor(
    @InjectModel(COLLECTIONS.LeaveType)
    private leaveTypeModel: Model<LeaveType>,
  ) {}

  async getLeaveType(filter: FilterQuery<LeaveType>) {
    return this.leaveTypeModel.findOne(filter);
  }

  async getAllLeaveType(filter: FilterQuery<LeaveType>) {
    return this.leaveTypeModel.find(filter);
  }

  async createLeaveType(data: CreateLeaveTypeDto) {
    const newLeaveType = new this.leaveTypeModel(data);
    return newLeaveType.save();
  }

  async editLeaveType(id: string, data: EditLeaveTypeDto) {
    return this.leaveTypeModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteLeaveType(id: string, user: any) {
    return this.leaveTypeModel.findByIdAndUpdate(
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

  async changeStatusLeaveType(id: string, data: any) {
    return this.leaveTypeModel.findByIdAndUpdate(id, data, { new: true });
  }

  async aggregate(pipeline: PipelineStage[]) {
    return this.leaveTypeModel.aggregate(pipeline);
  }
}

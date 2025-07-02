import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import { COLLECTIONS } from 'src/utils/common';
import { LeaveTypeMaster } from './leaveTypeMaster.schema';
import { CreateLeaveTypeDto } from './dto/createLeaveTypeMaster.dto';
import { EditLeaveTypeDto } from './dto/editLeaveTypeMaster.dto';

@Injectable()
export class LeaveTypeMasterService {
  constructor(
    @InjectModel(COLLECTIONS.LeaveTypeMaster)
    private leaveTypeMasterModel: Model<LeaveTypeMaster>,
  ) {}

  async getLeaveType(filter: FilterQuery<LeaveTypeMaster>) {
    return this.leaveTypeMasterModel.findOne(filter);
  }

  async getAllLeaveType(filter: FilterQuery<LeaveTypeMaster>) {
    return this.leaveTypeMasterModel.find(filter);
  }

  async createLeaveType(data: CreateLeaveTypeDto) {
    const newLeaveType = new this.leaveTypeMasterModel(data);
    return newLeaveType.save();
  }

  async editLeaveType(id: string, data: EditLeaveTypeDto) {
    return this.leaveTypeMasterModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteLeaveType(id: string, user: any) {
    return this.leaveTypeMasterModel.findByIdAndUpdate(
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
    return this.leaveTypeMasterModel.findByIdAndUpdate(id, data, { new: true });
  }

  async aggregate(pipeline: PipelineStage[]) {
    return this.leaveTypeMasterModel.aggregate(pipeline);
  }
}

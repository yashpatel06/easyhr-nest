import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import { COLLECTIONS } from 'src/utils/common';
import { CompanyLeaveType } from './companyLeaveType.schema';
import { CreateCompanyLeaveTypeDto } from './dto/createCompanyLeaveType';
import { EditCompanyLeaveTypeDto } from './dto/editCompanyLeaveType';

@Injectable()
export class CompanyLeaveTypeService {
  constructor(
    @InjectModel(COLLECTIONS.CompanyLeaveType)
    private companyLeaveTypeModel: Model<CompanyLeaveType>,
  ) {}

  async getCompanyLeaveType(filter: FilterQuery<CompanyLeaveType>) {
    return this.companyLeaveTypeModel.findOne(filter);
  }

  async getAllCompanyLeaveType(filter: FilterQuery<CompanyLeaveType>) {
    return this.companyLeaveTypeModel.find(filter);
  }

  async createCompanyLeaveType(data: CreateCompanyLeaveTypeDto) {
    const newLeaveType = new this.companyLeaveTypeModel(data);
    return newLeaveType.save();
  }

  async editCompanyLeaveType(id: string, data: EditCompanyLeaveTypeDto) {
    return this.companyLeaveTypeModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async deleteCompanyLeaveType(id: string, user: any) {
    return this.companyLeaveTypeModel.findByIdAndUpdate(
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

  async changeStatusCompanyLeaveType(id: string, data: any) {
    return this.companyLeaveTypeModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async aggregate(pipeline: PipelineStage[]) {
    return this.companyLeaveTypeModel.aggregate(pipeline);
  }
}

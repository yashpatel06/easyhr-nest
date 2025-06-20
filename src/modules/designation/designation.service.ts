import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import { COLLECTIONS } from 'src/utils/common';
import { Designation } from './designation.schema';
import { CreateDesignationDto } from './dto/createDesignation.dto';
import { EditDesignationDto } from './dto/editDesignation.dto';

@Injectable()
export class DesignationService {
  constructor(
    @InjectModel(COLLECTIONS.Designation)
    private designationModel: Model<Designation>,
  ) {}

  async createDesignation(data: CreateDesignationDto) {
    const newDesignation = new this.designationModel(data);
    return newDesignation.save();
  }

  async getDesignation(filter: FilterQuery<Designation>) {
    return this.designationModel.findOne(filter);
  }

  async listDesignation() {
    return this.designationModel.find({ isDeleted: false });
  }

  async editDesignation(id: string, data: EditDesignationDto) {
    return this.designationModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteDesignation(id: string, user: any) {
    return this.designationModel.findByIdAndUpdate(
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

  async changeStatusDesignation(id: string, data: any) {
    return this.designationModel.findByIdAndUpdate(id, data, { new: true });
  }

  async aggregate(pipeline: PipelineStage[]) {
    return this.designationModel.aggregate(pipeline);
  }
}

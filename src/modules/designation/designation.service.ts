import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
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
    return this.designationModel.find({ isActive: true, isDeleted: false });
  }

  async editDesignation(id: string, data: EditDesignationDto) {
    return this.designationModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteDesignation(id: string) {
    return this.designationModel.findByIdAndUpdate(
      id,
      {
        $set: { isActive: false, isDeleted: true },
      },
      { new: true },
    );
  }
}

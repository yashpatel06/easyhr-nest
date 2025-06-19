import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { COLLECTIONS } from 'src/utils/common';
import { Company } from './company.schema';
import { CreateCompanyDto } from './dto/createCompany.dto';
import { EditCompanyDto } from './dto/editCompany.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(COLLECTIONS.Company) private companyModel: Model<Company>,
  ) {}

  async createCompany(data: CreateCompanyDto) {
    const newCompany = new this.companyModel(data);
    return newCompany.save();
  }

  async getCompany(filter: FilterQuery<Company>) {
    return this.companyModel.findOne(filter);
  }

  async listCompany() {
    return this.companyModel.find({ isDeleted: false });
  }

  async editCompany(id: string, editCompany: EditCompanyDto) {
    return this.companyModel.findByIdAndUpdate(id, editCompany, { new: true });
  }

  async deleteCompany(id: string, user: any) {
    return this.companyModel.findByIdAndUpdate(id, {
      $set: {
        isActive: false,
        isDeleted: true,
        deletedBy: user?._id,
        deletedAt: new Date(),
      },
    });
  }

  async changeStatusCompany(id: string, data: any) {
    return this.companyModel.findByIdAndUpdate(id, data, { new: true });
  }
}

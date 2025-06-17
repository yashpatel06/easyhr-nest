import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { COLLECTIONS } from 'src/utils/common';
import { Department } from './department.schema';
import { CreateDepartmentDto } from './dto/createDepartment.dto';
import { EditDepartmentDto } from './dto/editDepartment.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(COLLECTIONS.Department)
    private departmentModel: Model<Department>,
  ) {}

  async createDepartment(data: CreateDepartmentDto) {
    const newDepartment = new this.departmentModel(data);
    return newDepartment.save();
  }

  async getDepartment(filter: FilterQuery<Department>) {
    return this.departmentModel.findOne(filter);
  }

  async listDepartment() {
    return this.departmentModel.find({ isActive: true, isDeleted: false });
  }

  async editDepartment(id: string, data: EditDepartmentDto) {
    return this.departmentModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteDepartment(id: string) {
    return this.departmentModel.findByIdAndUpdate(
      id,
      { $set: { isActive: false, isDeleted: true } },
      { new: true },
    );
  }
}

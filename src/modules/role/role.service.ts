import { Injectable } from '@nestjs/common';
import { COLLECTIONS } from 'src/utils/common';
import { RoleMaster } from './role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import { CreateRoleDto } from './dto/createRole.dto';
import { EditRoleDto } from './dto/editRole.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(COLLECTIONS.RoleMaster) private roleModel: Model<RoleMaster>,
  ) {}

  async getRole(filter: FilterQuery<RoleMaster>) {
    return this.roleModel.findOne(filter);
  }

  async getAllRole(filter: FilterQuery<RoleMaster>) {
    return this.roleModel.find(filter);
  }

  async createRole(data: CreateRoleDto) {
    const newRole = new this.roleModel(data);
    return newRole.save();
  }

  async listRole() {
    return this.roleModel.find({ isDeleted: false });
  }

  async editRole(id: string, data: EditRoleDto) {
    return this.roleModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteRole(id: string, user: any) {
    return this.roleModel.findByIdAndUpdate(
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

  async changeStatusRole(id: string, data: any) {
    return this.roleModel.findByIdAndUpdate(id, data, { new: true });
  }

  async aggregate(pipeline: PipelineStage[]) {
    return this.roleModel.aggregate(pipeline);
  }
}

import { Injectable } from '@nestjs/common';
import { COLLECTIONS } from 'src/utils/common';
import { RoleMaster } from './role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
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

  async createRole(data: CreateRoleDto) {
    const newRole = new this.roleModel(data);
    return newRole.save();
  }

  async listRole() {
    return this.roleModel.find({ isActive: true, isDeleted: false });
  }

  async editRole(id: string, data: EditRoleDto) {
    return this.roleModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteRole(id: string) {
    return this.roleModel.findByIdAndUpdate(
      id,
      { $set: { isActive: false, isDeleted: true } },
      { new: true },
    );
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { COLLECTIONS } from 'src/utils/common';
import { PermissionMaster } from './permission.schema';
import { CreatePermissionDto } from './dto/createPermission.dto';
import { EditPermissionDto } from './dto/editPermission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(COLLECTIONS.PermissionMaster)
    private permissionModel: Model<PermissionMaster>,
  ) {}

  async createPermission(data: CreatePermissionDto) {
    const newPermission = new this.permissionModel(data);
    return newPermission.save();
  }

  async listPermission() {
    return this.permissionModel.find({ isDeleted: false });
  }

  async getAllPermission() {
    return this.permissionModel.find({ isActive: true, isDeleted: false });
  }

  async getPermission(filter: FilterQuery<PermissionMaster>) {
    return this.permissionModel.findOne(filter);
  }

  async editPermission(id: string, editPermission: EditPermissionDto) {
    return this.permissionModel.findByIdAndUpdate(id, editPermission, {
      new: true,
    });
  }

  async deletePermission(id: string, user: any) {
    return this.permissionModel.findByIdAndUpdate(
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

  async changeStatusPermission(id: string, data: any) {
    return this.permissionModel.findByIdAndUpdate(id, data, { new: true });
  }
}

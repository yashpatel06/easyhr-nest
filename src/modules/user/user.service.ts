import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { COLLECTIONS } from 'src/utils/common';
import { User } from './user.schema';
import { CreateUserDto } from './dto/createUser.dto';
import { EditUserDto } from './dto/editUser.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(COLLECTIONS.User) private userModel: Model<User>) {}

  async createUser(userData: CreateUserDto) {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async listUsers() {
    return this.userModel.find({ isActive: true, isDeleted: false });
  }

  async getUser(filter: FilterQuery<User>) {
    return this.userModel.findOne(filter);
  }

  async editUser(id: string, editUser: EditUserDto) {
    return this.userModel.findByIdAndUpdate(id, editUser, { new: true });
  }

  async deleteUser(id: string) {
    return this.userModel.findByIdAndUpdate(
      id,
      { $set: { isActive: false, isDeleted: true } },
      { new: true },
    );
  }
}

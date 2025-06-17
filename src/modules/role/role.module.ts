import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTIONS } from 'src/utils/common';
import { RoleMasterSchema } from './role.schema';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { clearScreenDown } from 'readline';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTIONS.RoleMaster,
        schema: RoleMasterSchema,
      },
    ]),
  ],
  providers: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}

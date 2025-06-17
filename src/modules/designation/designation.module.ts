import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTIONS } from 'src/utils/common';
import { DesignationSchema } from './designation.schema';
import { DesignationService } from './designation.service';
import { DesignationContoller } from './designation.controller';
import { RoleService } from '../role/role.service';
import { RoleModule } from '../role/role.module';
import { DeparatmentModule } from '../department/department.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTIONS.Designation,
        schema: DesignationSchema,
      },
    ]),
    RoleModule,
    DeparatmentModule,
  ],
  providers: [DesignationService],
  controllers: [DesignationContoller],
})
export class DesignationModule {}

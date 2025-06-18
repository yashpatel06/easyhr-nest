import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTIONS } from 'src/utils/common';
import { DesignationSchema } from './designation.schema';
import { DesignationService } from './designation.service';
import { DesignationContoller } from './designation.controller';
import { RoleService } from '../role/role.service';
import { RoleModule } from '../role/role.module';
import { DeparatmentModule } from '../department/department.module';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTIONS.Designation,
        schema: DesignationSchema,
      },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => RoleModule),
    forwardRef(() => DeparatmentModule),
  ],
  providers: [DesignationService, AuthGuard],
  controllers: [DesignationContoller],
})
export class DesignationModule {}

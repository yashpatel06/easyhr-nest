import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTIONS } from 'src/utils/common';
import { EmployeeLeaveSchema } from './employeeLeave.schema';
import { AuthModule } from '../auth/auth.module';
import { EmployeeLeaveService } from './employeeLeave.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { EmployeeLeaveController } from './employeeLeave.controller';
import { CompanyLeaveTypeModule } from '../companyLeaveType/companyLeaveType.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTIONS.EmployeeLeave,
        schema: EmployeeLeaveSchema,
      },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => CompanyLeaveTypeModule),
  ],
  providers: [EmployeeLeaveService, AuthGuard],
  controllers: [EmployeeLeaveController],
  exports: [EmployeeLeaveService],
})
export class EmployeeLeaveModule {}

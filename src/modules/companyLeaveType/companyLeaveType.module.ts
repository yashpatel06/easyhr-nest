import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTIONS } from 'src/utils/common';
import { CompanyLeaveTypeSchema } from './companyLeaveType.schema';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from 'src/guards/auth.guard';
import { CompanyLeaveTypeService } from './companyLeaveType.service';
import { CompanyLeaveTypeController } from './companyLeaveType.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTIONS.CompanyLeaveType,
        schema: CompanyLeaveTypeSchema,
      },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [CompanyLeaveTypeService, AuthGuard],
  controllers: [CompanyLeaveTypeController],
  exports: [CompanyLeaveTypeService],
})
export class CompanyLeaveTypeModule {}

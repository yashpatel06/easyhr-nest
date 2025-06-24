import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTIONS } from 'src/utils/common';
import { LeaveTypeSchema } from './leaveType.schema';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from 'src/guards/auth.guard';
import { LeaveTypeService } from './leaveType.service';
import { LeaveTypeController } from './leaveType.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTIONS.LeaveType,
        schema: LeaveTypeSchema,
      },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [LeaveTypeService, AuthGuard],
  controllers: [LeaveTypeController],
  exports: [LeaveTypeService],
})
export class LeaveTypeModule {}

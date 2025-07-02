import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTIONS } from 'src/utils/common';
import { LeaveTypeMasterSchema } from './leaveTypeMaster.schema';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from 'src/guards/auth.guard';
import { LeaveTypeMasterService } from './leaveTypeMaster.service';
import { LeaveTypeMasterController } from './leaveTypeMaster.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTIONS.LeaveTypeMaster,
        schema: LeaveTypeMasterSchema,
      },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [LeaveTypeMasterService, AuthGuard],
  controllers: [LeaveTypeMasterController],
  exports: [LeaveTypeMasterService],
})
export class LeaveTypeMasterModule {}

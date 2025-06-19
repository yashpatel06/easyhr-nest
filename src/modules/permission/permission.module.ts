import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTIONS } from 'src/utils/common';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from 'src/guards/auth.guard';
import { PermissionMasterSchema } from './permission.schema';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTIONS.PermissionMaster,
        schema: PermissionMasterSchema,
      },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [PermissionService, AuthGuard],
  controllers: [PermissionController],
  exports: [PermissionService],
})
export class PermissionModule {}

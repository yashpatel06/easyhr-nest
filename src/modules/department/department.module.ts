import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTIONS } from 'src/utils/common';
import { DepartmentSchema } from './department.schema';
import { DepartmentContoller } from './department.controller';
import { DepartmentService } from './department.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: COLLECTIONS.Department, schema: DepartmentSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [DepartmentService, AuthGuard],
  controllers: [DepartmentContoller],
  exports: [DepartmentService],
})
export class DeparatmentModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTIONS } from 'src/utils/common';
import { DepartmentSchema } from './department.schema';
import { DepartmentContoller } from './department.controller';
import { DepartmentService } from './department.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: COLLECTIONS.Department, schema: DepartmentSchema },
    ]),
  ],
  providers: [DepartmentService],
  controllers: [DepartmentContoller],
  exports: [DepartmentService],
})
export class DeparatmentModule {}

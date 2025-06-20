import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTIONS } from 'src/utils/common';
import { CompanySchema } from './company.schema';
import { CompanyService } from './company.service';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from 'src/guards/auth.guard';
import { CompanyController } from './company.controller';
import { UsersModule } from '../user/user.module';
import { PermissionModule } from '../permission/permission.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTIONS.Company,
        schema: CompanySchema,
      },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => RoleModule),
    forwardRef(() => UsersModule),
    forwardRef(() => PermissionModule),
  ],
  providers: [CompanyService, AuthGuard],
  controllers: [CompanyController],
  exports: [CompanyService],
})
export class CompanyModule {}

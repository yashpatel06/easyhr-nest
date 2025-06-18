import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTIONS } from 'src/utils/common';
import { RoleMasterSchema } from './role.schema';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { clearScreenDown } from 'readline';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTIONS.RoleMaster,
        schema: RoleMasterSchema,
      },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [RoleService, AuthGuard],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}

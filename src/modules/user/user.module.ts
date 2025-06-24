import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTIONS } from 'src/utils/common';
import { UserSchema } from './user.schema';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTIONS.User,
        schema: UserSchema,
      },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => CompanyModule),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}

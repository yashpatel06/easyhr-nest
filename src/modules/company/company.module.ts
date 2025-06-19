import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTIONS } from 'src/utils/common';
import { CompanySchema } from './company.schema';
import { CompanyService } from './company.service';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from 'src/guards/auth.guard';
import { CompanyController } from './company.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTIONS.Company,
        schema: CompanySchema,
      },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [CompanyService, AuthGuard],
  controllers: [CompanyController],
  exports: [CompanyService],
})
export class CompanyModule {}

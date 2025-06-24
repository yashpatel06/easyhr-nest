import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import { DeparatmentModule } from './modules/department/department.module';
import { DesignationModule } from './modules/designation/designation.module';
import { PermissionModule } from './modules/permission/permission.module';
import { UploadController } from './modules/upload/upload.controller';
import { LeaveTypeModule } from './modules/leaveType/leaveType.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get('MONGO_URL'),
        connectionFactory: (connection) => {
          console.log('Database Connected Successfully');
          return connection;
        },
      }),
    }),
    UsersModule,
    AuthModule,
    PermissionModule,
    RoleModule,
    DeparatmentModule,
    DesignationModule,
    LeaveTypeModule,
  ],
  controllers: [AppController, UploadController],
  providers: [AppService],
})
export class AppModule {}

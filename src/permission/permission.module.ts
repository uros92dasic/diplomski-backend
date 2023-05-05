import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { CommonModule } from 'src/common/common.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { PermissionGuard } from './permission.guard';
import { UserModule } from 'src/user/user.module'
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UserModule,
    RoleModule
  ],
  controllers: [PermissionController],
  providers: [PrismaService, PermissionService, PermissionGuard],
  exports: [PermissionService, PermissionGuard]
})
export class PermissionModule { }

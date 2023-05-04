import { Module, forwardRef } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { CommonModule } from 'src/common/common.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { PermissionModule } from 'src/permission/permission.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UserModule,
    forwardRef(() => PermissionModule)
  ],
  controllers: [RoleController],
  providers: [PrismaService, RoleService],
  exports: [RoleService]
})
export class RoleModule { }

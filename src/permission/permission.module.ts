import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { CommonModule } from 'src/common/common.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    CommonModule
  ],
  controllers: [PermissionController],
  providers: [PrismaService, PermissionService],
  exports: [PermissionService]
})
export class PermissionModule { }

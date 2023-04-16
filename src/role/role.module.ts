import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { CommonModule } from 'src/common/common.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    CommonModule
  ],
  controllers: [RoleController],
  providers: [PrismaService, RoleService],
  exports: [RoleService]
})
export class RoleModule { }

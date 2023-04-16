import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from './user.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    CommonModule
  ],
  controllers: [UserController],
  providers: [PrismaService, UserService],
  exports: [UserService]
})
export class UserModule { }

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from './user.service';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    CommonModule,
    AuthModule
  ],
  controllers: [UserController],
  providers: [PrismaService, UserService],
  exports: [UserService]
})
export class UserModule { }

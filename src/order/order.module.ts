import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UserModule
  ],
  controllers: [OrderController],
  providers: [PrismaService, OrderService],
  exports: [OrderService]
})
export class OrderModule { }

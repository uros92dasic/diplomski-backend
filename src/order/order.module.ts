import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    CommonModule
  ],
  controllers: [OrderController],
  providers: [PrismaService, OrderService],
  exports: [OrderService]
})
export class OrderModule { }

import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    CommonModule
  ],
  controllers: [ProductController],
  providers: [PrismaService, ProductService],
  exports: [ProductService]
})
export class ProductModule { }

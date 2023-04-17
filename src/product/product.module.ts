import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommonModule } from 'src/common/common.module';
import { UploadController } from './upload.controller';

@Module({
  imports: [
    CommonModule
  ],
  controllers: [ProductController, UploadController],
  providers: [PrismaService, ProductService],
  exports: [ProductService]
})
export class ProductModule { }

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateProductDto } from './models/create-product.dto';
import { Product } from '@prisma/client';
import { UpdateProductDto } from './models/update-product.dto';
import { HasPermission } from 'src/permission/has-permission.decorator';

// @UseGuards(AuthGuard)
@Controller('products')
export class ProductController {
    constructor(private productService: ProductService) { }

    @Get()
    // @HasPermission('Products')
    getAll(@Query('page') page: number = 1) {
        return this.productService.paginate(page);
    }

    @UseGuards(AuthGuard)
    @Get('/orders')
    @HasPermission('Products')
    getAllExcludeUser(
        @Query('page') page: number = 1,
        @Query('userId') userId: string
    ) {
        return this.productService.paginateExcludeUser(page, parseInt(userId));
    }

    @UseGuards(AuthGuard)
    @Post()
    @HasPermission('Products')
    async create(@Body() body: CreateProductDto): Promise<Product> {

        return this.productService.create({
            data: {
                title: body.title,
                description: body.description,
                image: body.image,
                price: +(body.price),
                userId: +(body.userId)
            }
        });
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    @HasPermission('Products')
    async get(@Param('id') id: number) {
        return this.productService.findOne({ where: { id: +id } })
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    @HasPermission('Products')
    async update(
        @Param('id') id: number,
        @Body() body: UpdateProductDto
    ) {
        return this.productService.update(+id, body);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    @HasPermission('Products')
    async remove(@Param('id') id: number) {
        return this.productService.remove(+id);
    }
}

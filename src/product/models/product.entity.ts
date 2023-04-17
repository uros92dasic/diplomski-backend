import { Product } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ProductEntity implements Product {
    @ApiProperty()
    id: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    price: number;

    @ApiProperty()
    userId: number;
}
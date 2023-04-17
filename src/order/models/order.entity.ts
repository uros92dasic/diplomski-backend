import { Order } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class OrderEntity implements Order {
    @ApiProperty()
    id: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    userId: number;

    @ApiProperty()
    total: number;
}
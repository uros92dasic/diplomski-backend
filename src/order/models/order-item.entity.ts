import { OrderItem } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemEntity implements OrderItem {
    @ApiProperty()
    id: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    orderId: number;

    @ApiProperty()
    productId: number;

    @ApiProperty()
    quantity: number;
}

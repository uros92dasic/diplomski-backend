import { Order } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItemEntity } from './order-item.entity';

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

    @ApiProperty({ type: () => [OrderItemEntity] })
    orderItems: OrderItemEntity[];
}

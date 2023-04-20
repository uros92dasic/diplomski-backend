import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './models/create-order.dto';
import { UpdateOrderDto } from './models/update-order.dto';
import { UpdateOrderItemDto } from './models/update-order-item.dto';

@Injectable()
export class OrderService {
    constructor(private readonly prisma: PrismaService) { }

    async paginateOrders(page = 1) {
        const take = 10;
        const skip = (page - 1) * take;

        const roles = await this.prisma.order.findMany({
            take,
            skip,
            include: {
                orderItems: {
                    include: {
                        product: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            }
        });

        const total = await this.prisma.order.count();

        return {
            data: roles,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / take)
            }
        }
    }

    async paginateOrderItems(page = 1) {
        const take = 15;
        const skip = (page - 1) * take;

        const roles = await this.prisma.orderItem.findMany({
            take,
            skip,
            include: {
                product: {
                    include: {
                        user: true
                    }
                }
            }
        });

        const total = await this.prisma.orderItem.count();

        return {
            data: roles,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / take)
            }
        }
    }

    async create(createOrderDto: CreateOrderDto) {
        // Create the order
        const order = await this.prisma.order.create({
            data: {
                userId: createOrderDto.userId,
                total: 0, // You can update the total after creating the orderItem
            },
        });

        // Initialize total
        let total = 0;

        // Loop through the products and create order items
        for (const productData of createOrderDto.products) {
            // Find the product to get its price
            const product = await this.prisma.product.findUnique({
                where: { id: productData.productId },
            });

            if (!product) {
                throw new Error('Product not found');
            }

            // Calculate the total for this product
            total += product.price * productData.quantity;

            // Create the order item
            await this.prisma.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: productData.productId,
                    quantity: productData.quantity,
                },
            });
        }

        // Update the order total
        await this.prisma.order.update({
            where: { id: order.id },
            data: { total },
        });

        return order;
    }

    async updateOrder(orderId: number, updateOrderDto: UpdateOrderDto) {
        return await this.prisma.order.update({
            where: { id: orderId },
            data: {
                total: updateOrderDto.total,
            },
        });
    }

    async updateOrderItem(orderItemId: number, updateOrderItemDto: UpdateOrderItemDto) {
        return await this.prisma.orderItem.update({
            where: { id: orderItemId },
            data: {
                quantity: updateOrderItemDto.quantity,
            },
        });
    }

    async deleteOrderItem(orderItemId: number) {
        // First, find the order item to get the order it belongs to
        const orderItem = await this.prisma.orderItem.findUnique({
            where: { id: orderItemId },
        });

        if (!orderItem) {
            throw new Error('Order item not found');
        }

        // Delete the order item
        await this.prisma.orderItem.delete({
            where: { id: orderItemId },
        });

        // Recalculate the order total
        const orderItems = await this.prisma.orderItem.findMany({
            where: { orderId: orderItem.orderId },
            include: { product: true }
        });

        const total = orderItems.reduce(
            (sum, item) => sum + item.quantity * item.product.price,
            0
        );

        // Update the order total
        await this.prisma.order.update({
            where: { id: orderItem.orderId },
            data: { total },
        });
    }

}

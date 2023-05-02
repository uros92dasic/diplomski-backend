import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './models/create-order.dto';

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
                                user: {
                                    include: {
                                        role: true
                                    }
                                }
                            }
                        }
                    }
                },
                user: true
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
                where: { id: +(productData.productId) },
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
                    productId: +(productData.productId),
                    quantity: +(productData.quantity),
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

    async deleteOrder(orderId: number) {
        // Delete related order items first
        await this.prisma.orderItem.deleteMany({
            where: { orderId },
        });

        // Delete the order
        await this.prisma.order.delete({
            where: { id: orderId },
        });
    }

    async getOrderById(orderId: number) {
        return await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { orderItems: { include: { product: true } } },
        });
    }

}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './models/create-order.dto';
import { Readable } from 'stream';
import * as Papa from 'papaparse';

interface ChartResult {
    date: string;
    total: BigInt;
}

@Injectable()
export class OrderService {
    constructor(private readonly prisma: PrismaService) { }

    async paginateOrders(page = 1) {
        const take = 10;
        const skip = (page - 1) * take;

        const orders = await this.prisma.order.findMany({
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
            data: orders,
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

    async exportOrderById(orderId: number): Promise<Readable> {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: true,
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            throw new Error('Order not found');
        }

        const data = [
            {
                fullName: `${order.user.firstName} ${order.user.lastName}`,
                orderId: order.id,
                orderItems: order.orderItems.map(
                    (item) =>
                        `Product: ${item.product.title}, Quantity: ${item.quantity}`,
                ),
                totalPrice: order.total,
            },
        ];

        const csv = Papa.unparse(data);
        const readable = new Readable();
        readable._read = () => { }; // _read is required but you can noop it
        readable.push(csv);
        readable.push(null);

        return readable;
    }

    async chart(year: number, month: number): Promise<any> {
        const result = (await this.prisma.$queryRaw`
            SELECT to_char(o."createdAt", 'YYYY-MM-DD') as date, sum(p.price * i.quantity) as total
            FROM "Order" o
            JOIN "OrderItem" i on o.id = i."orderId"
            JOIN "Product" p on i."productId" = p.id
            WHERE EXTRACT(YEAR FROM o."createdAt") = ${+(year)} AND EXTRACT(MONTH FROM o."createdAt") = ${+(month)}
            GROUP BY date;
        `) as ChartResult[];

        const formattedResult = result.map(item => {
            return {
                date: item.date,
                total: item.total.toString(),
            };
        });

        return formattedResult;
    }


}

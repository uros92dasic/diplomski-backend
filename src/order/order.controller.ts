import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, Res, } from '@nestjs/common';
import { Response } from 'express';
import { OrderService } from './order.service';
import { CreateOrderDto } from './models/create-order.dto';
import { UpdateOrderDto } from './models/update-order.dto';
import { UpdateOrderItemDto } from './models/update-order-item.dto';

@Controller()
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Get('orders')
    async getAllOrders(@Query('page') page: number = 1) {
        return this.orderService.paginateOrders();
    }

    @Get('order-items')
    async getAllOrderItems(@Query('page') page: number = 1) {
        return this.orderService.paginateOrderItems();
    }

    @Post('orders')
    async createOrder(@Body() createOrderDto: CreateOrderDto, @Res() res: Response) {
        try {
            const order = await this.orderService.create(createOrderDto);
            res.status(HttpStatus.CREATED).json(order);
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    @Patch('orders/:orderId')
    async updateOrder(
        @Param('orderId', ParseIntPipe) orderId: number,
        @Body() updateOrderDto: UpdateOrderDto,
        @Res() res: Response
    ) {
        try {
            const updatedOrder = await this.orderService.updateOrder(orderId, updateOrderDto);
            res.status(HttpStatus.OK).json(updatedOrder);
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    @Patch('order-items/:orderItemId')
    async updateOrderItem(
        @Param('orderItemId', ParseIntPipe) orderItemId: number,
        @Body() updateOrderItemDto: UpdateOrderItemDto,
        @Res() res: Response
    ) {
        try {
            const updatedOrderItem = await this.orderService.updateOrderItem(orderItemId, updateOrderItemDto);
            res.status(HttpStatus.OK).json(updatedOrderItem);
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    @Delete('order-items/:orderItemId')
    async deleteOrderItem(
        @Param('orderItemId', ParseIntPipe) orderItemId: number,
        @Res() res: Response
    ) {
        try {
            await this.orderService.deleteOrderItem(orderItemId);
            res.status(HttpStatus.NO_CONTENT).send();
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }
}

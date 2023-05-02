import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, Res, } from '@nestjs/common';
import { Response } from 'express';
import { OrderService } from './order.service';
import { CreateOrderDto } from './models/create-order.dto';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Get()
    async getAllOrders(@Query('page') page: number = 1) {
        return this.orderService.paginateOrders(page);
    }

    @Post()
    async createOrder(@Body() createOrderDto: CreateOrderDto, @Res() res: Response) {
        try {
            const order = await this.orderService.create(createOrderDto);
            res.status(HttpStatus.CREATED).json(order);
        } catch (error) {
            console.error("Error in createOrder:", error.message);
            res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    @Delete(':orderId')
    async deleteOrder(
        @Param('orderId', ParseIntPipe) orderId: number,
        @Res() res: Response,
    ) {
        try {
            await this.orderService.deleteOrder(orderId);
            res.status(HttpStatus.NO_CONTENT).send();
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    @Get(':orderId')
    async getOrderById(@Param('orderId', ParseIntPipe) orderId: number) {
        return await this.orderService.getOrderById(orderId);
    }
}

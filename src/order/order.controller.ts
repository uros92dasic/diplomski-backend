import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Query, Req, Res, UseGuards, } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { OrderService } from './order.service';
import { CreateOrderDto } from './models/create-order.dto';
import { HasPermission } from 'src/permission/has-permission.decorator';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrderController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private orderService: OrderService
    ) { }

    @Get('chart/:year/:month')
    async chart(@Param('year') year: number, @Param('month') month: number) {
        return this.orderService.chart(year, month);
    }

    @Get()
    @HasPermission('Orders')
    async getAllOrders(@Req() request: Request, @Query('page') page: number = 1) {
        const userId = await this.authService.userId(request);
        const user = await this.userService.findOne({ where: { id: +userId }, include: { role: true } });
        return this.orderService.paginateOrders(page, user);
    }

    @Post()
    @HasPermission('Orders')
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
    @HasPermission('Orders')
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
    @HasPermission('Orders')
    async getOrderById(@Param('orderId', ParseIntPipe) orderId: number) {
        return await this.orderService.getOrderById(orderId);
    }

    @Get('export/:orderId')
    @HasPermission('Orders')
    async exportOrderById(@Param('orderId', ParseIntPipe) orderId: number, @Res() res: Response) {
        try {
            const readable = await this.orderService.exportOrderById(orderId);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader(
                'Content-Disposition',
                `attachment; filename=order-${orderId}-export.csv`,
            );
            readable.pipe(res);
        } catch (error) {
            console.error('Error in exportOrderById:', error.message);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

}

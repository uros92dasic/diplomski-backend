import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './models/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from './models/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';

@Controller('users')
// @UseGuards(AuthGuard)
export class UserController {
    constructor(
        private readonly userService: UserService,
        private authService: AuthService
    ) { }

    @Get()
    getAll(@Query('page') page: number = 1) {
        return this.userService.paginate(page);
    }

    @Post()
    async create(@Body() body: CreateUserDto): Promise<User> {
        const password = await bcrypt.hash('1234', 12)

        return this.userService.create({
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                password: password,
                roleId: +(body.roleId)
            }
        });
    }

    @Get(':id')
    async get(@Param('id') id: number) {
        return this.userService.findOne({ where: { id: +id } })
    }

    @Patch('info')
    async updateInfo(
        @Req() request: Request,
        @Body() body: UpdateUserDto
    ) {
        const userId = await this.authService.userId(request);

        await this.userService.update(+userId, body);

        return this.userService.findOne({ where: { id: +userId } })
    }

    @Patch('password')
    async updatePassword(
        @Req() request: Request,
        @Body('password') password: string,
        @Body('passwordConfirm') passwordConfirm: string,
    ) {
        if (password !== passwordConfirm) {
            throw new HttpException('Passwords do not match!', HttpStatus.BAD_REQUEST);
        }
        const hashed = await bcrypt.hash(password, 12)

        const userId = await this.authService.userId(request);

        await this.userService.update(+userId, {
            password: hashed
        });

        return this.userService.findOne(+userId)

    }

    @Patch(':id')
    async update(
        @Param('id') id: number,
        @Body() body: UpdateUserDto
    ) {
        return this.userService.update(+id, body);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return this.userService.remove(+id);
    }
}

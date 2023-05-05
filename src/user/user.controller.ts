import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './models/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from './models/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { HasPermission } from 'src/permission/has-permission.decorator';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private authService: AuthService
    ) { }

    @Get()
    @HasPermission('Users')
    getAll(@Query('page') page: number = 1) {
        return this.userService.paginate(page);
    }

    @Post()
    @HasPermission('Users')
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
    @HasPermission('Users')
    async get(@Param('id') id: number) {
        return this.userService.findOne({ where: { id: +id } })
    }

    @Patch('info')
    //@HasPermission('Profile')
    async updateInfo(
        @Req() request: Request,
        @Body() body: UpdateUserDto
    ) {
        const userId = await this.authService.userId(request);

        await this.userService.profileUpdate(+userId, body);

        return this.userService.findOne({ where: { id: +userId } })
    }

    @Patch('password')
    //@HasPermission('Profile')
    async updatePassword(
        @Req() request: Request,
        @Body('password') password: string,
        @Body('passwordConfirm') passwordConfirm: string,
    ) {
        if (!password.trim() || !passwordConfirm.trim()) {
            throw new HttpException('Password and password confirm fields cannot be empty!', HttpStatus.BAD_REQUEST);
        }
        if (password !== passwordConfirm) {
            throw new HttpException('Passwords do not match!', HttpStatus.BAD_REQUEST);
        }

        const hashed = await bcrypt.hash(password, 12)

        const userId = await this.authService.userId(request);

        await this.userService.updatePassword(+userId, hashed);

        return this.userService.findOne({ where: { id: +userId } })
    }

    @Patch(':id')
    @HasPermission('Users')
    async update(
        @Param('id') id: number,
        @Body() body: UpdateUserDto
    ) {
        return this.userService.update(+id, body);
    }

    @Delete(':id')
    @HasPermission('Users')
    async remove(@Param('id') id: number) {
        return this.userService.remove(+id);
    }
}

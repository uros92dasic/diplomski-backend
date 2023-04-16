import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './models/create-user.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    getAll() {
        return this.userService.findAll();
    }

    @Post()
    async create(@Body() body: CreateUserDto): Promise<User> {
        const password = await bcrypt.hash('1234', 12)

        return this.userService.create({
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                password: password
            }
        });
    }
}

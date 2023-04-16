import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './models/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from './models/update-user.dto';

@Controller('users')
@UseGuards(AuthGuard)
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

    @Get(':id')
    async get(@Param('id') id: number) {
        return this.userService.findOne({ where: { id: +id } })
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

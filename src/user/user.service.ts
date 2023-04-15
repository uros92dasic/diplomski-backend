import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './models/create-user.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    findAll() {
        return this.prisma.user.findMany();
    }

    async create(createUserDto: CreateUserDto) {
        return this.prisma.user.create({ data: createUserDto });
    }

    async findOne(condition) {
        return this.prisma.user.findUnique(condition);
    }
}

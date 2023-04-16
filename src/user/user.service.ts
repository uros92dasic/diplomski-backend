import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    findAll() {
        return this.prisma.user.findMany();
    }

    async create(body): Promise<User> {
        return this.prisma.user.create(body);
    }

    async findOne(condition) {
        return this.prisma.user.findUnique(condition);
    }
}

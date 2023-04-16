import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleService {
    constructor(private prisma: PrismaService) { }

    async paginate(page = 1) {
        const take = 15;
        const skip = (page - 1) * take;

        const roles = await this.prisma.role.findMany({
            take,
            skip
        });

        const total = await this.prisma.role.count();

        return {
            data: roles,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / take)
            }
        }
    }

    findAll() {
        return this.prisma.role.findMany();
    }

    async create(body): Promise<Role> {
        return this.prisma.role.create(body);
    }

    async findOne(condition) {
        return this.prisma.role.findUnique(condition);
    }

    async update(id: number, data): Promise<any> {
        return this.prisma.role.update({
            where: {
                id
            },
            data: data
        })
    }

    async remove(id: number): Promise<any> {
        return this.prisma.role.delete({ where: { id } })
    }
}

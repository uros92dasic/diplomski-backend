import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async paginate(page = 1) {
        const take = 10;
        const skip = (page - 1) * take;

        const users = await this.prisma.user.findMany({
            take,
            skip,
            include: {
                role: true
            }
        });

        const total = await this.prisma.user.count();

        return {
            data: users.map(user => {
                const { password, createdAt, updatedAt, ...data } = user;

                return data;
            }),
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / take)
            }
        }
    }

    findAll() {
        return this.prisma.user.findMany();
    }

    async findOne(condition): Promise<any> {
        return this.prisma.user.findUnique({ ...condition, include: { role: true } });
    }

    async create(body): Promise<User> {
        return this.prisma.user.create(body);
    }

    async update(id: number, data): Promise<any> {
        const { roleId, ...restData } = data;

        return this.prisma.user.update({
            where: {
                id
            },
            data: {
                ...restData,
                role: {
                    connect: {
                        id: parseInt(roleId)
                    }
                }
            },
            include: {
                role: true
            }
        });
    }

    async remove(id: number): Promise<any> {
        return this.prisma.user.delete({ where: { id } })
    }

    async profileUpdate(id: number, data): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email
            }
        });
    }

    async updatePassword(id: number, hashedPassword: string): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data: {
                password: hashedPassword,
            },
        });
    }
}

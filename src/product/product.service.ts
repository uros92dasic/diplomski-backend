import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async paginate(page = 1) {
        const take = 10;
        const skip = (page - 1) * take;

        const roles = await this.prisma.product.findMany({
            take,
            skip
        });

        const total = await this.prisma.product.count();

        return {
            data: roles,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / take)
            }
        }
    }

    async paginateExcludeUser(page = 1, userId: number) {
        const take = 10;
        const skip = (page - 1) * take;

        const products = await this.prisma.product.findMany({
            where: {
                userId: {
                    not: userId
                }
            },
            take,
            skip
        });

        const total = await this.prisma.product.count({
            where: {
                userId: {
                    not: userId
                }
            }
        });

        return {
            data: products,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / take)
            }
        }
    }

    findAll() {
        return this.prisma.product.findMany();
    }

    async findOne(condition): Promise<any> {
        return this.prisma.product.findUnique(condition);
    }

    async create(body): Promise<Product> {
        return this.prisma.product.create(body);
    }

    async update(id: number, data): Promise<any> {
        return this.prisma.product.update({
            where: {
                id
            },
            data: {
                title: data.title,
                description: data.description,
                image: data.image,
                price: +(data.price),
                userId: data.userId
            }
        })
    }

    async remove(id: number): Promise<any> {
        return this.prisma.product.delete({ where: { id } })
    }
}

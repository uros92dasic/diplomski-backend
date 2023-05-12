import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async paginate(page = 1, searchTerm = '', userId = null) {
        const take = 10;
        const skip = (page - 1) * take;
        const where: Prisma.ProductWhereInput = {
            AND: [
                {
                    OR: [
                        {
                            title: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            description: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                    ],
                },
                ...(+userId ? [{ userId: +(userId) }] : []),
            ],
        };

        const products = await this.prisma.product.findMany({
            where,
            include: {
                user: true,
            },
            take,
            skip,
        });

        const total = await this.prisma.product.count({
            where,
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

    async paginateExcludeUser(page = 1, userId: number, searchTerm = '') {
        const take = 10;
        const skip = (page - 1) * take;
        const where: Prisma.ProductWhereInput = {
            AND: [
                {
                    userId: {
                        not: userId,
                    },
                },
                {
                    OR: [
                        {
                            title: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            description: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                    ],
                },
            ],
        }

        const products = await this.prisma.product.findMany({
            where,
            take,
            skip,
        });

        const total = await this.prisma.product.count({
            where,
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

    async search(query: string) {
        return this.prisma.product.findMany({
            where: {
                title: {
                    contains: query,
                    mode: 'insensitive', // This makes the search case-insensitive
                },
            },
        });
    }

}

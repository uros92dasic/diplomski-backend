import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async paginate(page = 1) {
        try {
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
        } catch (error) {
            throw new HttpException('Error while fetching users', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    findAll() {
        try {
            return this.prisma.user.findMany();
        } catch (error) {
            throw new HttpException('Error while fetching all users', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(condition): Promise<any> {
        try {
            return this.prisma.user.findUnique({
                ...condition, include: {
                    role: {
                        include: {
                            rolePermissions: {
                                include: {
                                    permission: true
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            throw new HttpException('Error while fetching user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async create(body): Promise<User> {
        try {
            return await this.prisma.user.create(body);
        } catch (error) {
            if (error.code === 'P2002') {
                throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Error while creating user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id: number, data): Promise<any> {
        try {
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
        } catch (error) {
            throw new HttpException('Error while updating user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async remove(id: number): Promise<any> {
        try {
            return this.prisma.user.delete({ where: { id } });
        } catch (error) {
            throw new HttpException('Error while deleting user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async profileUpdate(id: number, data): Promise<User> {
        try {
            return this.prisma.user.update({
                where: { id },
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email
                }
            });
        } catch (error) {
            throw new HttpException('Error while updating user profile', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updatePassword(id: number, hashedPassword: string): Promise<User> {
        try {
            return this.prisma.user.update({
                where: { id },
                data: {
                    password: hashedPassword,
                },
            });
        } catch (error) {
            throw new HttpException('Error while updating user password', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

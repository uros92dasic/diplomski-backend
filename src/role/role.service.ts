import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './models/create-role.dto';
import { UpdateRoleDto } from './models/update-role.dto';

@Injectable()
export class RoleService {
    constructor(private prisma: PrismaService) { }

    async paginate(page = 1) {
        const take = 20;
        const skip = (page - 1) * take;

        const roles = await this.prisma.role.findMany({
            take,
            skip,
            include: {
                users: {
                    include: {
                        products: true
                    }
                },
                rolePermissions: {
                    include: {
                        permission: true
                    }
                }
            }
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

    async create(body: CreateRoleDto) {
        const { name, permissions } = body;

        return this.prisma.role.create({
            data: {
                name,
                rolePermissions: {
                    create: permissions.map(permissionId => ({
                        permission: { connect: { id: permissionId } },
                    })),
                },
            },
            include: {
                rolePermissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });
    }

    async update(id: number, body: UpdateRoleDto) {
        const { name, permissions } = body;

        const updateData: Prisma.RoleUpdateInput = {};

        if (name) {
            updateData.name = name;
        }

        if (permissions) {
            updateData.rolePermissions = {
                deleteMany: {},
            };

            Object.assign(updateData.rolePermissions, {
                create: permissions.map(permissionId => ({
                    permission: { connect: { id: permissionId } },
                })),
            });
        }

        return this.prisma.role.update({
            where: { id },
            data: updateData,
            include: {
                users: {
                    include: {
                        products: true
                    }
                },
                rolePermissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });
    }

    findAll() {
        return this.prisma.role.findMany({
            include: {
                rolePermissions: {
                    include: {
                        permission: true
                    }
                }
            }
        });
    }

    async findOne(id: number) {
        return this.prisma.role.findUnique({
            where: {
                id
            },
            include: {
                rolePermissions: {
                    include: {
                        permission: true
                    }
                }
            }
        });
    }

    async remove(id: number): Promise<any> {
        // Check if there's a user with the given role
        const userWithRole = await this.prisma.user.findFirst({
            where: {
                roleId: id,
            },
        });

        // If a user with the role exists, throw an HTTP exception
        if (userWithRole) {
            throw new HttpException(
                'The role cannot be deleted as it is assigned to a user.',
                HttpStatus.BAD_REQUEST,
            );
        }

        // If no user with the role exists, proceed with deletion
        // First, delete the related RolePermission records
        await this.prisma.rolePermission.deleteMany({
            where: {
                roleId: id,
            },
        });

        // Then, delete the role
        return this.prisma.role.delete({
            where: {
                id,
            },
        });
    }
}

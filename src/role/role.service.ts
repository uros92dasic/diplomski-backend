import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './models/create-role.dto';
import { UpdateRoleDto } from './models/update-role.dto';

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
                rolePermissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });
    }

    findAll() {
        return this.prisma.role.findMany();
    }

    async findOne(condition) {
        return this.prisma.role.findUnique({
            ...condition,
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
        return this.prisma.role.delete({ where: { id } })
    }
}

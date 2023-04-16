import { Injectable } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionService {
    constructor(private prisma: PrismaService) { }

    async findAll(): Promise<Permission[]> {
        return this.prisma.permission.findMany();
    }
}

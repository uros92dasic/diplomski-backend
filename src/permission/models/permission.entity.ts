import { Permission } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class PermissionEntity implements Permission {
    @ApiProperty()
    id: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    name: string;
}
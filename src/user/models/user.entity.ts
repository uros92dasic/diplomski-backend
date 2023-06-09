import { Role, User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from 'src/role/models/role.entity';

export class UserEntity implements User {
    @ApiProperty()
    id: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    roleId: number;

    @ApiProperty({ type: () => RoleEntity })
    role: Role;
}
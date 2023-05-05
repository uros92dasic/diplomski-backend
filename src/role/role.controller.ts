import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateRoleDto } from './models/create-role.dto';
import { UpdateRoleDto } from './models/update-role.dto';
import { HasPermission } from 'src/permission/has-permission.decorator';

@UseGuards(AuthGuard)
@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    @Get()
    @HasPermission('Roles')
    getAll(@Query('page') page: number = 1) {
        return this.roleService.paginate(page);
    }

    @Post()
    @HasPermission('Roles')
    async create(@Body() createRoleDto: CreateRoleDto) {
        return this.roleService.create(createRoleDto);
    }

    @Get(':id')
    @HasPermission('Roles')
    async get(@Param('id') id: number) {
        return this.roleService.findOne(+id)
    }

    @Patch(':id')
    @HasPermission('Roles')
    async update(
        @Param('id') id: number,
        @Body() body: UpdateRoleDto
    ) {
        return this.roleService.update(+id, body);
    }

    @Delete(':id')
    @HasPermission('Roles')
    async remove(@Param('id') id: number) {
        return this.roleService.remove(+id);
    }
}

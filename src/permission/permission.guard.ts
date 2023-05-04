import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { RoleService } from 'src/role/role.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService
  ) { }

  async canActivate(context: ExecutionContext) {
    const access = this.reflector.get<string>('access', context.getHandler())
    if (!access) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const id = await this.authService.userId(request);

    const user = await this.userService.findOne({ where: { id: +id } });

    const roleId = user.role.id;

    const role = await this.roleService.findOne(+roleId);

    if (request.method === 'GET') {
      return role.rolePermissions.some(p => (p.permission.name === `view${access}`) || (p.permission.name === `edit${access}`))
    }

    return role.rolePermissions.some(p => p.permission.name === `edit${access}`);
  }
}

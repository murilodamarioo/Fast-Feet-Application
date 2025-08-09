import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { CHECK_ROLES_KEY, CheckRoles } from './roles.decorator'
import { AbilityFactory, AppAbility } from './ability.factory'

import { UserPayload } from '../auth/jwt.strategy'
import { PrismaService } from '../database/prisma/prisma.service'
import { RoleHandler } from './roleHandler'

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
    private prisma: PrismaService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Read any roles attached to the controller/route method via CheckRoles()
    const roleHandlers = this.reflector.get<RoleHandler[]>(CHECK_ROLES_KEY, context.getHandler()) || []

    const request = context.switchToHttp().getRequest()

    const requestUser: UserPayload = request.user

    const user = await this.prisma.user.findUnique({
      where: {
        id: requestUser.sub
      }
    })

    const requestParam = request.params.id

    const ability = this.abilityFactory.defineAbilitiesFor(user, requestParam)

    return roleHandlers.every((roleHandler) => this.execRoleHandler(roleHandler, ability))
  }

  private execRoleHandler(handler: RoleHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability)
    }

    return handler.handle(ability)
  }

}
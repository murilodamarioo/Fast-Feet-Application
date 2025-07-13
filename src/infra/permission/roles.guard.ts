import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { Observable } from 'rxjs'

import { Roles } from './roles.decorator'
import { UserPayload } from '../auth/jwt.strategy'
import { PrismaService } from '../database/prisma/prisma.service'

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler())

    if(!roles) {
      return true
    }

    const request = context.switchToHttp().getRequest()

    const requestUser: UserPayload = request.user

    const user = await this.prisma.user.findUnique({
      where: {
        id: requestUser.sub
      }
    })

    if (!user || !user.role) {
      return false
    }

    return roles.includes(user.role)
  }

}
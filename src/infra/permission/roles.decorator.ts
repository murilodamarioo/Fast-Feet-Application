import { RoleHandler } from './roleHandler'
import { SetMetadata } from '@nestjs/common'

export const CHECK_ROLES_KEY = 'check_role'
export const CheckRoles = (...handlers: RoleHandler[]) => SetMetadata(CHECK_ROLES_KEY, handlers)
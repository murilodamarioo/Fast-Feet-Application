import { AppAbility } from './ability.factory'

interface IRoleHandler {
  handle(ability: AppAbility): boolean
}

type RoleHandlerCallback = (ability: AppAbility) => boolean

export type RoleHandler = IRoleHandler | RoleHandlerCallback
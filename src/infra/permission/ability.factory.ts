import { AbilityBuilder, createMongoAbility, ExtractSubjectType, MongoAbility } from '@casl/ability'
import { Injectable } from '@nestjs/common'
import { Role } from '@prisma/client'

export enum Action {
  MANAGE = 'manage',
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  PENDING = 'pending',
  PICKUP = 'pickup',
  RETURN = 'return',
  DELIVER = 'deliver'
}

export type Subject = 'Courier' | 'Recipient' | 'Order' | 'all'

export type AppAbility = MongoAbility<[Action, Subject]>

@Injectable()
export class AbilityFactory {

  defineAbilitiesFor(user: any, requestParam: string) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

    if (user.role === Role.ADMIN) {
      can(Action.MANAGE, 'Courier')
      cannot(Action.PENDING, 'Courier')
      cannot(Action.PICKUP, 'Courier')
      cannot(Action.RETURN, 'Courier')
      cannot(Action.DELIVER, 'Courier')

      can(Action.MANAGE, 'Recipient')
      cannot(Action.PENDING, 'Recipient')
      cannot(Action.PICKUP, 'Recipient')
      cannot(Action.RETURN, 'Recipient')
      cannot(Action.DELIVER, 'Recipient')

      can(Action.MANAGE, 'Order')
      cannot(Action.PENDING, 'Order')
      cannot(Action.PICKUP, 'Order')
      cannot(Action.RETURN, 'Order')
      cannot(Action.DELIVER, 'Order')
    } else if (user.role === Role.COURIER) {
      if (requestParam === user.id) {
        can(Action.READ, 'Courier')
        can(Action.UPDATE, 'Courier')
      }

      can(Action.PICKUP, 'Order')
      can(Action.DELIVER, 'Order')
    }

    return build({
      detectSubjectType: (item: any) => item.constructor as ExtractSubjectType<Subject>
    })
  }
}
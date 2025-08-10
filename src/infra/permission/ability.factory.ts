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

export type Subject = 'Courier' | 'Recipient' | 'Order' | 'Admin' | 'all'

export type AppAbility = MongoAbility<[Action, Subject]>

@Injectable()
export class AbilityFactory {

  defineAbilitiesFor(user: any, requestParam: string) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    const adminAbilities = () => {
      can(Action.MANAGE, 'Admin');
      if (requestParam !== user.id) {
        cannot(Action.UPDATE, 'Admin');
        cannot(Action.DELETE, 'Admin');
      }
      can(Action.MANAGE, 'Courier');
      can(Action.MANAGE, 'Recipient');
      can(Action.MANAGE, 'Order');
      cannot(Action.PICKUP, 'Order');
      cannot(Action.DELIVER, 'Order');
    };

    const courierAbilities = () => {
      if (requestParam === user.id) {
        can(Action.READ, 'Courier');
        can(Action.UPDATE, 'Courier');
      }
      can(Action.READ, 'Order');
      can(Action.PICKUP, 'Order');
      can(Action.DELIVER, 'Order');
      cannot(Action.RETURN, 'Order');
    };

    switch (user.role) {
      case Role.ADMIN:
        adminAbilities();
        break;
      case Role.COURIER:
        courierAbilities();
        break;
      default:
        break;
    }

    return build({
      detectSubjectType: (item: any) => item.constructor as ExtractSubjectType<Subject>,
    });
  }
}
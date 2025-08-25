import { Prisma, Photo as PrismaPhoto } from '@prisma/client'

import { OrderPhoto } from '@/domain/delivery/enterprise/entities/Order-Photo'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export class PrismaOrderPhotoMapper {
  static toDomain(raw: PrismaPhoto): OrderPhoto {
    if (!raw.orderId) {
      throw new Error('Invalid attachment type.')
    }

    return OrderPhoto.create(
      {
        photoId: new UniqueEntityId(raw.id),
        orderId: new UniqueEntityId(raw.orderId),
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrismaUpdate(
    photo: OrderPhoto,
  ): Prisma.PhotoUpdateArgs {
    return {
      where: {
        id: photo.photoId.toString(),
      },
      data: {
        orderId: photo.orderId.toString(),
      },
    }
  }
}
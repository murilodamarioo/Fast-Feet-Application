import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrderPhoto, OrderPhotoProps } from '@/domain/delivery/enterprise/entities/Order-Photo'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeOrderPhoto(override: Partial<OrderPhotoProps> = {}, id?: UniqueEntityId) {
  const orderPhoto = OrderPhoto.create({
    orderId: new UniqueEntityId(),
    photoId: new UniqueEntityId(),
    ...override
  }, id)

  return orderPhoto
}

@Injectable()
export class OrderPhotoFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaOrderPhoto(data: Partial<OrderPhotoProps> = {}): Promise<OrderPhoto> {
    const orderPhoto = makeOrderPhoto(data)

    await this.prisma.photo.update({
      where: {
        id: orderPhoto.photoId.toString()
      },
      data: {
        orderId: orderPhoto.orderId.toString()
      }
    })

    return orderPhoto
  }
}
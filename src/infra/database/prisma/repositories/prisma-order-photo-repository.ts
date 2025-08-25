import { Injectable } from '@nestjs/common'

import { OrderPhotosRepository } from '@/domain/delivery/application/repositories/order-photos-repository'
import { OrderPhoto } from '@/domain/delivery/enterprise/entities/Order-Photo'

import { PrismaService } from '../prisma.service'

import { PrismaOrderPhotoMapper } from '../mappers/prisma-order-photo-mapper'

@Injectable()
export class PrismaOrderPhotosRepository implements OrderPhotosRepository {

  constructor(private prisma: PrismaService) { }

  async create(photo: OrderPhoto): Promise<void> {
    const data = PrismaOrderPhotoMapper.toPrismaUpdate(photo)

    await this.prisma.photo.update(data)
  }

}
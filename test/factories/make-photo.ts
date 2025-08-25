import { Injectable } from '@nestjs/common'
import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Photo, PhotoProps } from '@/domain/delivery/enterprise/entities/Photo'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaPhotoMapper } from '@/infra/database/prisma/mappers/prisma-photo-mapper'

export function makePhoto(override: Partial<PhotoProps> = {}, id?: UniqueEntityId) {
  const photo = Photo.create({
    name: faker.lorem.slug(),
    url: faker.image.url(),
    ...override
  }, id)

  return photo
}

@Injectable()
export class PhotoFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaPhoto(data: Partial<PhotoProps> = {}): Promise<Photo> {
    const photo = makePhoto(data)

    await this.prisma.photo.create({
      data: PrismaPhotoMapper.toPrisma(photo)
    })

    return photo
  }
}
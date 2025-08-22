import { Photo } from '@/domain/delivery/enterprise/entities/Photo'
import { Prisma } from '@prisma/client'

export class PrismaPhotoMapper {

  static toPrisma(photo: Photo): Prisma.PhotoUncheckedCreateInput {
    return {
      id: photo.id.toString(),
      name: photo.name,
      url: photo.url
    }
  }

}
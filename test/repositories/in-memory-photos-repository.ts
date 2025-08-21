import { PhotosRepository } from '@/domain/delivery/application/repositories/photos-repository'
import { Photo } from '@/domain/delivery/enterprise/entities/Photo';

export class InMemoryPhotosRespository implements PhotosRepository {

  public photos: Photo[] = []

  async create(photo: Photo): Promise<void> {
    this.photos.push(photo)
  }

}
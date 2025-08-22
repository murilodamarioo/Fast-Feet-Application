import { OrderPhotosRepository } from '@/domain/delivery/application/repositories/order-photos-repository'
import { OrderPhoto } from '@/domain/delivery/enterprise/entities/Order-Photo'

export class InMemoryOrderPhotosRepository implements OrderPhotosRepository {
  public orderPhotos: OrderPhoto[] = []

  async create(photo: OrderPhoto): Promise<void> {
    this.orderPhotos.push(photo)
  }
  
}
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface OrderPhotoProps {
  orderId: UniqueEntityId
  photoId: UniqueEntityId
}

export class OrderPhoto extends Entity<OrderPhotoProps> {

  get orderId() { return this.props.orderId }

  get photoId() { return this.props.photoId }

  static create(props: OrderPhotoProps, id?: UniqueEntityId) {
    const photo = new OrderPhoto(props, id)

    return photo
  }
}
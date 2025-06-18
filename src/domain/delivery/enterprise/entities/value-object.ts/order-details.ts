import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface OrderDetailsProps {
  // Data
  recipientId: UniqueEntityId
  courierId: UniqueEntityId
  recipient: string
  address: string
  neighborhood: string
  zipCode: string
  state: string

  // Situation
  status: string
  postedAt?: Date | null
  pickedUp?: Date | null
  deliveredAt?: Date | null
}

export class OrderDetails extends ValueObject<OrderDetailsProps> {

  get recipientId() { return this.props.recipientId }

  get courierId() { return this.props.courierId }
  
  get recipient() { return this.props.recipient }

  get adress() { return this.props.address }

  get neighborhood() { return this.props.neighborhood }

  get zipCode() { return this.props.zipCode }

  get status() { return this.props.status }

  get postedAt() { return this.props.postedAt }

  get pickedUp() { return this.props.pickedUp }

  get deliveredAt() { return this.props.deliveredAt }
  
  static create(props: OrderDetailsProps) {
    return new OrderDetails(props)
  }
}
import { OrderDetails } from '@/domain/delivery/enterprise/entities/value-object.ts/order-details'

export class OrderDetailsPresenter {

  static toHTTP(order: OrderDetails) {
    return {
      recipient: order.recipient,
      address: order.address,
      neighborhood: order.neighborhood,
      zipCode: order.zipCode,
      status: order.status,
      postedAt: order.postedAt,
      pickuedUp: order.pickedUp,
      deliveredAt: order.deliveredAt,
    }
  }

}
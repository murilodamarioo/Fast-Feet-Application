import { Order } from '@/domain/delivery/enterprise/entities/Order'

export class OrderPresenter {

  static toHTTP(order: Order) {
    return {
      id: order.id,
      orderName: order.orderName,
      status: order.status,
      postedAt: order.postedAt
    }
  }

}
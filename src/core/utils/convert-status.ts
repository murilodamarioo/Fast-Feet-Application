import { OrderStatus } from '@prisma/client'

export function convertStatus(status: string): OrderStatus {
  switch (status) {
    case 'created':
      return OrderStatus.CREATED;
    case 'pending':
      return OrderStatus.PENDING;
    case 'picked_up':
      return OrderStatus.PICKED_UP;
    case 'delivered':
      return OrderStatus.DELIVERED;
    case 'returned':
      return OrderStatus.RETURNED;
    default:
      throw new Error(`Invalid order status: ${status}`);
  }
}
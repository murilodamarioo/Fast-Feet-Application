export enum Status {
  CREATED = 'created',
  PENDING = 'pending',
  PICKED_UP = 'picked_up',
  DELIVERED = 'delivered',
  RETURNED = 'returned'
}

export namespace StatusUtils {

  export function isCreated(status: Status) {
    return status === Status.CREATED
  }

  export function isPending(status: Status) {
    return status === Status.PENDING
  }
  
  export function isPickedUp(status: Status) {
    return status === Status.PICKED_UP
  }
  
  export function isDelivered(status: Status) {
    return status === Status.DELIVERED
  }
  
  export function isReturned(status: Status) {
    return status === Status.RETURNED
  }
}
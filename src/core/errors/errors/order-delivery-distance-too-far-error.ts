import { UseCaseError } from '@/core/errors/use-case-error'

export class OrderDeliveryDistanceTooFarError extends Error implements UseCaseError {
  constructor() {
    super(
      'Delivery cannot be completed: the distance to the recipient exceeds the allowed limit.'
    )
  }
}
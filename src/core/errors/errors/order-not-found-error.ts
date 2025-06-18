import { UseCaseError } from '@/core/errors/use-case-error'

export class OrderNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('The order was not found')
  }
}
import { UseCaseError } from '@/core/errors/use-case-error'

export class AdminNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Admin not found')
  }
}
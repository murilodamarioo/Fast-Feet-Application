import { UseCaseError } from '@/core/errors/use-case-error'

export class UserAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super('User with the same CPF already exists')
  }
}
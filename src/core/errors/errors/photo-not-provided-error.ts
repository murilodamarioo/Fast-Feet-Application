import { UseCaseError } from '@/core/errors/use-case-error' 

export class PhotoNotProvidedError extends Error implements UseCaseError {
  constructor() {
    super('Photo is required')
  }
}
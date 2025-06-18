import { UseCaseError } from '@/core/errors/use-case-error'
import { Status } from '@/domain/delivery/enterprise/entities/value-object.ts/Status'

export class SetOrderStatusError extends Error implements UseCaseError {
  constructor(fromStatus: Status, toStatus: Status) {
    super(
      `Impossible to change to ${toStatus}, because the status is no longer ${fromStatus}`
    )
  }
}
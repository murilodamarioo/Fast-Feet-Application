import { Either, failure, success } from '@/core/either'
import { AdminNotFoundError } from '@/core/errors/errors/admin-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { AdminRepository } from '../repositories/admin-repository'

export interface ChangeAdminPasswordUseCaseRequest {
  adminId: string
  newPassword: string
}

type ChangeAdminPasswordUseCaseResponse = Either<AdminNotFoundError | NotAllowedError, null>

export class ChangeAdminPasswordUseCase {

  constructor(private adminRepository: AdminRepository) {}

  async execute(
    { adminId, newPassword }: ChangeAdminPasswordUseCaseRequest
  ): Promise<ChangeAdminPasswordUseCaseResponse>  {
    const admin = await this.adminRepository.findById(adminId)
    
    if (!admin) {
      return failure(new AdminNotFoundError())
    }

    admin.password = newPassword
    await this.adminRepository.save(admin)

    return success(null)
  }
}
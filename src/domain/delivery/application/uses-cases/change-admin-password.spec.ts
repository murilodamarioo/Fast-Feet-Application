import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { ChangeAdminPasswordUseCase } from './change-admin-password'
import { makeAdmin } from 'test/factories/make-admin'

let inMemoryAdminRepository: InMemoryAdminRepository
let sut: ChangeAdminPasswordUseCase

describe('Change Admin password', () => {

  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    sut = new ChangeAdminPasswordUseCase(inMemoryAdminRepository)
  })

  it('should be able to change an admin password', async () => {
    const admin = makeAdmin()
    inMemoryAdminRepository.admins.push(admin)

    const response = await sut.execute({
      adminId: admin.id.toString(),
      newPassword: 'new-password'
    })

    expect(response.isSuccess).toBeTruthy()
    expect(inMemoryAdminRepository.admins[0].password).toBe('new-password')
  })
})
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { ChangeAdminPasswordUseCase } from './change-admin-password'
import { makeAdmin } from 'test/factories/make-admin'
import { HashGenerator } from '../cryptography/hash-generator'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryAdminRepository: InMemoryAdminRepository
let fakeHasher: FakeHasher
let sut: ChangeAdminPasswordUseCase

describe('Change Admin password', () => {

  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    fakeHasher = new FakeHasher()
    sut = new ChangeAdminPasswordUseCase(inMemoryAdminRepository, fakeHasher)
  })

  it('should be able to change an admin password', async () => {
    const admin = makeAdmin()
    inMemoryAdminRepository.admins.push(admin)

    const response = await sut.execute({
      adminId: admin.id.toString(),
      newPassword: 'new-password'
    })

    expect(response.isSuccess).toBeTruthy()
    expect(inMemoryAdminRepository.admins[0].password).toBe('new-password-hashed')
  })
})
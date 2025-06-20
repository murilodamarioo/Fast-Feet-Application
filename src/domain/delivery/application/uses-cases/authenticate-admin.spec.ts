import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { FakeHaher } from 'test/cryptography/fake-hasher'
import { FakeEcrypter } from 'test/cryptography/fake-encrypter'
import { AuthenticateAdminUseCase } from './authenticate-admin'
import { makeAdmin } from 'test/factories/make-admin'

let sut: AuthenticateAdminUseCase
let inMemoryAdminRepository: InMemoryAdminRepository
let fakeHasher: FakeHaher
let fakeEncrypter: FakeEcrypter

describe('Authenticate an Admin', () => {

  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    fakeHasher = new FakeHaher()
    fakeEncrypter = new FakeEcrypter()
    sut = new AuthenticateAdminUseCase(inMemoryAdminRepository, fakeHasher, fakeEncrypter)
  })

  it('should be able to authenticate an Admin', async () => {
    const admin = makeAdmin({
      cpf: '12345676512',
      password: await fakeHasher.hash('nEwP@ssw0rd') 
    })

    inMemoryAdminRepository.admins.push(admin)

    const response = await sut.execute({
      cpf: '12345676512',
      password: 'nEwP@ssw0rd'
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(response.value).toEqual({
      access_token: expect.any(String)
    })
  })
})
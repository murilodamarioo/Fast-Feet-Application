import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { RegisterAdminUseCase } from './register-admin'
import { FakeHaher } from 'test/cryptography/fake-hasher'

let sut: RegisterAdminUseCase
let inMemoryAdminRepository: InMemoryAdminRepository
let fakeHasher: FakeHaher

describe('Register an Admin', () => {

  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    fakeHasher = new FakeHaher()
    sut = new RegisterAdminUseCase(inMemoryAdminRepository, fakeHasher)
  })

  it('should be able to register a new Admin', async () => {
    const response = await sut.execute({
      name: 'John Doe',
      email: 'john@gmail.com',
      cpf: '12345676512',
      password: 'nEwP@ssw0rd'
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(response.value).toMatchObject({
      admin: expect.objectContaining({
         name: 'John Doe'
      })
    })
  })

  it('should hash Admin password upon registration', async () => {
    const response = await sut.execute({
      name: 'John Doe',
      email: 'john@gmail.com',
      cpf: '12345676512',
      password: 'nEwP@ssw0rd'
    })

    const hashedPassword = await fakeHasher.hash('nEwP@ssw0rd')

    expect(response.isSuccess()).toBeTruthy()
    expect(inMemoryAdminRepository.admins[0].password).toEqual(hashedPassword)
  }) 

})
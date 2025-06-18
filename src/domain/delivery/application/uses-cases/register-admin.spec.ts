import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { RegisterAdminUseCase } from './register-admin'

let sut: RegisterAdminUseCase
let inMemoryAdminRepository: InMemoryAdminRepository

describe('Register an Admin', () => {

  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    sut = new RegisterAdminUseCase(inMemoryAdminRepository)
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

})
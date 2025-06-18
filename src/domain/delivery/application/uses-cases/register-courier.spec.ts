import { InMemoryCourierRepository } from 'test/repositories/in-memory-courier-reposiotry'
import { RegisterCourierUseCase } from './register-courier'
import { makeCourier } from 'test/factories/make-courier'
import { UserAlreadyExistsError } from '@/core/errors/errors/user-already-exists-error'


let sut: RegisterCourierUseCase
let inMemoryCourierRepository: InMemoryCourierRepository

describe('Register Courier', () => {

  beforeEach(() => {
    inMemoryCourierRepository = new InMemoryCourierRepository()
    sut = new RegisterCourierUseCase(inMemoryCourierRepository)
  })

  it('should be able to create a new courier', async () => {
    const response = await sut.execute({
      name: 'Flash',
      cpf: '345.567.123-17',
      email: 'flashpoint@gmail.com',
      password: '123456'
    })

    expect(response.isSuccess()).toBe(true)
    expect(response.value).toEqual({
      courier: inMemoryCourierRepository.couriers[0]
    })
  })

  it('should not be able to create a courier with the same CPF', async () => {

    const courier = makeCourier({ cpf: '34556712317' })
    await sut.execute(courier)

    const response = await sut.execute({
      name: 'Flash',
      cpf: '34556712317',
      email: 'flashpoint@gmail.com',
      password: '123456'
    })

    expect(response.isFailure()).toBe(true)
    expect(response.value).instanceOf(UserAlreadyExistsError)
  })
})
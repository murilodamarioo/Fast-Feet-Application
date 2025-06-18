import { InMemoryCourierRepository } from 'test/repositories/in-memory-courier-reposiotry'
import { EditCourierUseCase } from './edit-courier'
import { makeCourier } from 'test/factories/make-courier'
import { CourierNotFoundError } from '@/core/errors/errors/courier-not-found-error'

let sut: EditCourierUseCase
let inMemoryCourierRepository: InMemoryCourierRepository

describe('Edit Courier', () => {

  beforeEach(() => {
    inMemoryCourierRepository = new InMemoryCourierRepository()
    sut = new EditCourierUseCase(inMemoryCourierRepository)
  })

  it('should be able to edit a courier', async () => {
    const courier = makeCourier({
      name: 'Courier 01',
      cpf: '12345678901',
      email: 'courier01@gmail.com',
      password: '123456'
    })

    await inMemoryCourierRepository.create(courier)

    const response = await sut.execute({
      courierId: courier.id.toString(),
      name: 'courier 02',
      cpf: '4321098765',
      email: 'courier02@gmail.com',
    })

    expect(response.isSuccess()).toBe(true)
    expect(inMemoryCourierRepository.couriers[0]).toMatchObject({
      name: 'courier 02',
      cpf: '4321098765',
      email: 'courier02@gmail.com'
    })
  })

  it('should not be able to edit a non-existing courier', async () => {
    const courier = makeCourier()

    await inMemoryCourierRepository.create(courier)

    const response = await sut.execute({
      courierId: 'invalid-id',
      name: 'New Name',
      cpf: '12345678901',
      email: 'newemail@gmail.com',
    })

    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(CourierNotFoundError)
  })
})
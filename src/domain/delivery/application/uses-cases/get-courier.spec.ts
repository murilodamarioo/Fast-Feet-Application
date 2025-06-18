import { InMemoryCourierRepository } from 'test/repositories/in-memory-courier-reposiotry'
import { GetCourierUseCase } from './get-courier'
import { makeCourier } from 'test/factories/make-courier'
import { CourierNotFoundError } from '@/core/errors/errors/courier-not-found-error'

let sut: GetCourierUseCase
let inMemoryCourierRepository: InMemoryCourierRepository

describe('Get Courier', () => {

  beforeEach(() => {
    inMemoryCourierRepository = new InMemoryCourierRepository()
    sut = new GetCourierUseCase(inMemoryCourierRepository)
  })

  it('should be able to get a courier by ID', async () => {
    const courier = makeCourier()

    await inMemoryCourierRepository.create(courier)

    const response = await sut.execute({
      courierId: courier.id.toString()
    })

    expect(response.isSuccess()).toBe(true)
    expect(response.value).toEqual({
      courier: inMemoryCourierRepository.couriers[0]
    })
  })

  it('should not be able to get a courier with an invalid ID', async () => {
    const courier = makeCourier()

    await inMemoryCourierRepository.create(courier)

    const response = await sut.execute({
      courierId: 'invalid-id'
    })

    expect(response.isFailure()).toBe(true)
    expect(inMemoryCourierRepository.couriers.length).toBe(1)
    expect(response.value).instanceOf(CourierNotFoundError)
  })
})
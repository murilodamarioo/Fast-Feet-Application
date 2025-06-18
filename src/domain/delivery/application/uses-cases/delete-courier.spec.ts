import { InMemoryCourierRepository } from 'test/repositories/in-memory-courier-reposiotry'
import { DeleteCourierUseCase } from './delete-courier'
import { makeCourier } from 'test/factories/make-courier'
import { CourierNotFoundError } from '@/core/errors/errors/courier-not-found-error'

let sut: DeleteCourierUseCase
let inMemoryCourierRepository: InMemoryCourierRepository

describe('Delete Courier', () => {

  beforeEach(() => {
    inMemoryCourierRepository = new InMemoryCourierRepository()
    sut = new DeleteCourierUseCase(inMemoryCourierRepository)
  })

  it('should be able to delete a courier by ID', async () => {
    const courier = makeCourier()

    await inMemoryCourierRepository.create(courier)

    const response = await sut.execute({
      courierId: courier.id.toString()
    })

    expect(response.isSuccess()).toBe(true)
    expect(inMemoryCourierRepository.couriers).toHaveLength(0)
  })

  it('should not be able to delete a courier with an invalid ID', async () => {
    const courier = makeCourier()

    await inMemoryCourierRepository.create(courier)

    const response = await sut.execute({
      courierId: 'invalid-id'
    })

    expect(response.isFailure()).toBe(true)
    expect(inMemoryCourierRepository.couriers).toHaveLength(1)
    expect(response.value).toBeInstanceOf(CourierNotFoundError)
  })
})
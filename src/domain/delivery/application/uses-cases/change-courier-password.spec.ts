import { InMemoryCourierRepository } from 'test/repositories/in-memory-courier-reposiotry'
import { ChangeCourierPasswordUseCase } from './change-courier-password'
import { makeCourier } from 'test/factories/make-courier'

let inMemoryCourierRepository: InMemoryCourierRepository
let sut: ChangeCourierPasswordUseCase

describe('Change Courier password', () => {
  
  beforeEach(() => {
    inMemoryCourierRepository = new InMemoryCourierRepository()
    sut = new ChangeCourierPasswordUseCase(inMemoryCourierRepository)
  })

  it('should be able to change a courier password', async () => {
    const courier = makeCourier()
    inMemoryCourierRepository.couriers.push(courier)

    const oldPassword = courier.password

    const response = await sut.execute({
      courierId: courier.id.toString(),
      newPassword: 'new-password'
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(inMemoryCourierRepository.couriers[0].password).not.toBe(oldPassword)
    expect(inMemoryCourierRepository.couriers[0].password).toBe('new-password')
  })
})
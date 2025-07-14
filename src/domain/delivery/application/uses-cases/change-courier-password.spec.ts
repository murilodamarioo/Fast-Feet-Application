import { InMemoryCourierRepository } from 'test/repositories/in-memory-courier-reposiotry'
import { ChangeCourierPasswordUseCase } from './change-courier-password'
import { makeCourier } from 'test/factories/make-courier'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryCourierRepository: InMemoryCourierRepository
let fakeHasher: FakeHasher
let sut: ChangeCourierPasswordUseCase

describe('Change Courier password', () => {
  
  beforeEach(() => {
    inMemoryCourierRepository = new InMemoryCourierRepository()
    fakeHasher = new FakeHasher()
    sut = new ChangeCourierPasswordUseCase(inMemoryCourierRepository, fakeHasher)
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
    expect(inMemoryCourierRepository.couriers[0].password).toBe('new-password-hashed')
  })
})
import { InMemoryCourierRepository } from 'test/repositories/in-memory-courier-reposiotry' 
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEcrypter } from 'test/cryptography/fake-encrypter'

import { AuthenticateCourierUseCase } from './authenticate-courier'
import { makeCourier } from 'test/factories/make-courier'

let sut: AuthenticateCourierUseCase
let inMemoryCourierRepository: InMemoryCourierRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEcrypter

describe('Authenticate Courier', () => {

  beforeEach(() => {
    inMemoryCourierRepository = new InMemoryCourierRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEcrypter()
    sut = new AuthenticateCourierUseCase(inMemoryCourierRepository, fakeHasher, fakeEncrypter)
  })

  it('should be able to authenticate a courier', async () => {
    const courier = makeCourier({
      cpf: '12345676512',
      password: await fakeHasher.hash('nEwP@ssw0rd')
    })

    inMemoryCourierRepository.couriers.push(courier)

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
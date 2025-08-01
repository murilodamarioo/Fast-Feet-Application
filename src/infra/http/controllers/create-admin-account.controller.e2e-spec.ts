import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Admin account (E2E)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  test('[POST] /accounts/admin', async () => {
    const response = await request(app.getHttpServer()).post('/accounts/admin')
      .send({
        name: 'John Doe',
        email: 'john@gmail.com',
        cpf: '9087654321',
        password: '12345'
      })

    expect(response.statusCode).toBe(201)
  })
})
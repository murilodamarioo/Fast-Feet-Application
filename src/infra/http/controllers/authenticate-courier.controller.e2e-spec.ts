import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { hash } from 'bcryptjs'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { CourierFactory } from 'test/factories/make-courier'
import request from 'supertest'

describe('Authenticate Courier (E2E)', () => {
  let app: INestApplication
  let courierFactory: CourierFactory

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory]
    }).compile()

    app = moduleRef.createNestApplication()
    courierFactory = moduleRef.get<CourierFactory>(CourierFactory)

    await app.init()
  })

  test('[POST] /sessions/couriers', async () => {
    await courierFactory.makePrismaCourier({
      cpf: '123744755243',
      password: await hash('nEwP@ssw0rd', 8)
    })

    const response = await request(app.getHttpServer())
      .post('/sessions/couriers')
      .send({
        cpf: '123744755243',
        password: 'nEwP@ssw0rd'
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String)
    })
  })
})
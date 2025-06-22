import { hash } from 'bcryptjs'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { AdminFactory } from 'test/factories/make-admin'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Authenticate Admin (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  it('[POST] /sessions/admin', async () => {
    await adminFactory.makePrismaAdmin({
      cpf: '43265432289',
      password: await hash('12345', 8)
    })

    const response = await request(app.getHttpServer())
      .post('/sessions/admin')
      .send({
        cpf: '43265432289',
        password: '12345'
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String)
    })
  })
})
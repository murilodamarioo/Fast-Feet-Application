import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { AdminFactory } from 'test/factories/make-admin'
import request from 'supertest'

describe('Create courier account (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory]
    }).compile()

    app = moduleRef.createNestApplication()
    adminFactory = moduleRef.get(AdminFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /accounts/courier', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const acessToken = jwt.sign({ sub: admin.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/accounts/courier')
      .set('Authorization', `Bearer ${acessToken}`)
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        cpf: '12345678901',
        password: 'password123'
      })

    expect(response.status).toBe(201)
  })
})

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AdminFactory } from 'test/factories/make-admin'
import { CourierFactory } from 'test/factories/make-courier'

import request from 'supertest'

describe('Get courier (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let courierFacotry: CourierFactory
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, CourierFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)
    courierFacotry = moduleRef.get(CourierFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /couriers/:id', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const courier = await courierFacotry.makePrismaCourier()
    const courierId = courier.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/couriers/${courierId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      courier: expect.objectContaining({
        id: courier.id.toString(),
        name: courier.name,
        email: courier.email,
        cpf: courier.cpf
      })
    })
  })
})
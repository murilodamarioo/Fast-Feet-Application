import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { CourierFactory } from 'test/factories/make-courier'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import request from 'supertest'

describe('Edit courier (E2E)', () => {
  let app: INestApplication
  let courierFactory: CourierFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    courierFactory = moduleRef.get(CourierFactory)
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[PUT] /accounts/courier/:id', async () => {
    const courier = await courierFactory.makePrismaCourier({
      email: 'john@gmail.com'
    })

    const courierId = courier.id.toString()

    const accessToken = jwt.sign({ sub: courier.id.toString() })

    const response = await request(app.getHttpServer())
      .put(`/accounts/courier/${courierId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        cpf: '12345678'
      })

    expect(response.statusCode).toBe(200)

    const courierOnDatase = prisma.user.findFirst({
      where: {
        cpf: '12345678'
      }
    })

    expect(courierOnDatase).toBeTruthy()
  })
})
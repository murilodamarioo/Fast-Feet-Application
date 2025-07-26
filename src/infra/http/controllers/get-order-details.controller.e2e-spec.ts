import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { CourierFactory } from 'test/factories/make-courier'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

import request from 'supertest'

describe('Get Order Details (E2E)', () => {
  let app: INestApplication
  let courierFactory: CourierFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory, OrderFactory, RecipientFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    courierFactory = moduleRef.get(CourierFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[GET] /orders/:id', async () => {
    const courier = await courierFactory.makePrismaCourier()
    const accessToken = jwt.sign({ sub: courier.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await orderFactory.makePrismaOrder({
      courierId: courier.id,
      recipientId: recipient.id
    })
    const orderId = order.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      order: expect.objectContaining({
        recipient: recipient.name,
        address: recipient.address,
        neighborhood: recipient.neighborhood,
        zipCode: recipient.zipCode,
      }),
    })
  })
})
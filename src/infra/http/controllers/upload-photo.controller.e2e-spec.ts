import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { INestApplication } from '@nestjs/common'

import { Status } from '@/domain/delivery/enterprise/entities/value-object.ts/Status'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { CourierFactory } from 'test/factories/make-courier'
import { RecipientFactory } from 'test/factories/make-recipient'
import { OrderFactory } from 'test/factories/make-order'

import request from 'supertest'

describe('Upload photo (E2E)', () => {
  let app: INestApplication
  let courierFactory: CourierFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let jwt: JwtService


  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory, RecipientFactory, OrderFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    courierFactory = moduleRef.get(CourierFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /orders/:id/upload-photo', async () => {
    const courier = await courierFactory.makePrismaCourier()
    const accessToken = jwt.sign({ sub: courier.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await orderFactory.makePrismaOrder({
      courierId: courier.id,
      recipientId: recipient.id,
      status: Status.PICKED_UP
    })

    const response = await request(app.getHttpServer())
      .post(`/orders/${order.id.toString()}/upload-photo`)
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/package-delivered.jpg')

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      photoId: expect.any(String)
    })
  })
})
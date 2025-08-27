import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { AdminFactory } from 'test/factories/make-admin'
import { CourierFactory } from 'test/factories/make-courier'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

import request from 'supertest'
import { Status } from '@/domain/delivery/enterprise/entities/value-object.ts/Status'
import { OrderStatus } from '@prisma/client'

describe('Set order status to returned (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let courierFactory: CourierFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, CourierFactory, RecipientFactory, OrderFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)
    courierFactory = moduleRef.get(CourierFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /orders/:id/retuned', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const courier = await courierFactory.makePrismaCourier()

    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await orderFactory.makePrismaOrder({
      courierId: courier.id,
      recipientId: recipient.id,
      status: Status.PICKED_UP
    })

    const response = await request(app.getHttpServer())
      .put(`/orders/${order.id.toString()}/returned`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(204)

    const orderOnDatabase = await prisma.order.findUnique({
      where: {
        id: order.id
      }
    })

    expect(orderOnDatabase?.status).toBe(OrderStatus.RETURNED)
  })

  test('[PUT] /orders/:id/retuned - Forbidden', async () => {
    const courier = await courierFactory.makePrismaCourier()
    const accessToken = jwt.sign({ sub: courier.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await orderFactory.makePrismaOrder({
      courierId: courier.id,
      recipientId: recipient.id,
      status: Status.PICKED_UP
    })

    const response = await request(app.getHttpServer())
      .put(`/orders/${order.id.toString()}/returned`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(403)
  })
})
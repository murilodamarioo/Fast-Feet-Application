import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { CourierFactory } from 'test/factories/make-courier'
import { OrderFactory } from 'test/factories/make-order'

import request from 'supertest'
import { RecipientFactory } from 'test/factories/make-recipient'
import { Status } from '@/domain/delivery/enterprise/entities/value-object.ts/Status'
import { OrderStatus } from '@prisma/client'
import { AdminFactory } from 'test/factories/make-admin'

describe('Set order status to picked up (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let courierFactory: CourierFactory
  let orderFacotry: OrderFactory
  let recipientFactory: RecipientFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, CourierFactory, OrderFactory, RecipientFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)
    courierFactory = moduleRef.get(CourierFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFacotry = moduleRef.get(OrderFactory)

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /orders/:id/pick-up', async () => {
    const courier = await courierFactory.makePrismaCourier()
    const accessToken = jwt.sign({ sub: courier.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await orderFacotry.makePrismaOrder({
      courierId: courier.id,
      recipientId: recipient.id,
      status: Status.PENDING
    })
    const orderId = order.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/orders/${orderId}/pick-up`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(204)

    const orderOnDatabase = await prisma.order.findUnique({
      where: {
        id: order.id
      }
    })

    expect(orderOnDatabase?.status).toBe(OrderStatus.PICKED_UP)
  })

  test('[PUT] /orders/:id/pick-up - Forbidden', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await orderFacotry.makePrismaOrder({
      courierId: admin.id,
      recipientId: recipient.id,
      status: Status.PENDING
    })
    const orderId = order.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/orders/${orderId}/pick-up`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(403)
  })
})
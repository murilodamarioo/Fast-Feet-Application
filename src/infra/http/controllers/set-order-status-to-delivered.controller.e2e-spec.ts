import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import request from 'supertest'

import { Status } from '@/domain/delivery/enterprise/entities/value-object.ts/Status'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { CourierFactory } from 'test/factories/make-courier'
import { OrderFactory } from 'test/factories/make-order'
import { AdminFactory } from 'test/factories/make-admin'
import { PhotoFactory } from 'test/factories/make-photo'
import { RecipientFactory } from 'test/factories/make-recipient'

import { OrderStatus } from '@prisma/client'


describe('Set order status to delivered (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let courierFactory: CourierFactory
  let recipientFactory: RecipientFactory
  let orderFacotry: OrderFactory
  let photoFactory: PhotoFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, CourierFactory, RecipientFactory, OrderFactory, PhotoFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)
    courierFactory = moduleRef.get(CourierFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFacotry = moduleRef.get(OrderFactory)
    photoFactory = moduleRef.get(PhotoFactory)

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /orders/:id/deliver', async () => {
    const courier = await courierFactory.makePrismaCourier()
    const accessToken = jwt.sign({ sub: courier.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient({
      latitude: -23.5937123,
      longitude: -46.5802722
    })

    const order = await orderFacotry.makePrismaOrder({
      courierId: courier.id,
      recipientId: recipient.id,
      status: Status.PICKED_UP
    })

    const photoAttachment = await photoFactory.makePrismaPhoto()

    const response = await request(app.getHttpServer())
      .put(`/orders/${order.id.toString()}/deliver`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        photoId: photoAttachment.id.toString(),
        latitude: -23.5937123,
        longitude: -46.5802722
      })

    expect(response.status).toBe(204)

    const orderOnDatabase = await prisma.order.findUnique({
      where: {
        id: order.id.toString()
      }
    })

    expect(orderOnDatabase).toBeTruthy()
    expect(orderOnDatabase).toMatchObject({
      id: order.id.toString(),
      recipientId: order.recipientId.toString(),
      status: OrderStatus.DELIVERED
    })

    const photoOnDatabase = await prisma.photo.findMany({
      where: {
        orderId: order.id.toString()
      }
    })

    expect(photoOnDatabase).toHaveLength(1)
  })

  test('[PUT] /orders/:id/deliver - Forbidden', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const courier = await courierFactory.makePrismaCourier()

    const recipient = await recipientFactory.makePrismaRecipient({
      latitude: -23.5937123,
      longitude: -46.5802722
    })

    const order = await orderFacotry.makePrismaOrder({
      courierId: courier.id,
      recipientId: recipient.id,
      status: Status.PICKED_UP
    })

    const photoAttachment = await photoFactory.makePrismaPhoto()

    const response = await request(app.getHttpServer())
      .put(`/orders/${order.id.toString()}/deliver`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        photoId: photoAttachment.id.toString(),
        latitude: -23.5937123,
        longitude: -46.5802722
      })

    expect(response.status).toBe(403)
  })
})
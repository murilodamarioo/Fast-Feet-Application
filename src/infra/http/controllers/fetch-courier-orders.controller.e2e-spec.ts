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

describe('Fetch courier orders (E2E)', () => {
  let app: INestApplication
  let courierFactory: CourierFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let prisma: PrismaService
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

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /courier/orders/:status', async () => {
    const courier = await courierFactory.makePrismaCourier()
    const accessToken = jwt.sign({ sub: courier.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    await Promise.all([
      orderFactory.makePrismaOrder({ courierId: courier.id, recipientId: recipient.id, orderName: '01', status: Status.PENDING }),
      orderFactory.makePrismaOrder({ courierId: courier.id, recipientId: recipient.id, orderName: '02', status: Status.PENDING }),
      orderFactory.makePrismaOrder({ courierId: courier.id, recipientId: recipient.id, orderName: '03', status: Status.PENDING }),
      orderFactory.makePrismaOrder({ courierId: courier.id, recipientId: recipient.id, orderName: '04' }),
      orderFactory.makePrismaOrder({ courierId: courier.id, recipientId: recipient.id, orderName: '05' }),
    ])

    const response = await request(app.getHttpServer())
      .get('/courier/orders/pending')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      value: {
        orders: expect.arrayContaining([
          expect.objectContaining({ orderName: '01' }),
          expect.objectContaining({ orderName: '02' }),
          expect.objectContaining({ orderName: '03' }),
        ]),
      },
    })
  })
}) 
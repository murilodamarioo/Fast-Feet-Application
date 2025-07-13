import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { INestApplication } from '@nestjs/common'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import request from 'supertest'
import { CourierFactory } from 'test/factories/make-courier'
import { RecipientFactory } from 'test/factories/make-recipient'
import { AdminFactory } from 'test/factories/make-admin'



describe('Create Order (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let courierFactory: CourierFactory
  let recipientFactory: RecipientFactory
  let adminFactory: AdminFactory
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory, RecipientFactory, AdminFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    courierFactory = moduleRef.get(CourierFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    adminFactory = moduleRef.get(AdminFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /order', async () => {
    const courier = await courierFactory.makePrismaCourier()
    const recipient = await recipientFactory.makePrismaRecipient()

    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/order')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        orderName: '01',
        recipientId: recipient.id.toString(),
        courierId: courier.id.toString()
      })

    expect(response.statusCode).toBe(201)

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        recipientId: recipient.id.toString(),
      }
    })

    expect(orderOnDatabase).toBeTruthy()
  })

  test('POST /order - Forbidden', async () => {
    const courier = await courierFactory.makePrismaCourier()
    const recipient = await recipientFactory.makePrismaRecipient()

    const accessToken = jwt.sign({ sub: courier.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/order')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        orderName: '02',
        recipientId: recipient.id.toString(),
        courierId: courier.id.toString()
      })

    expect(response.statusCode).toBe(403)
  })
})
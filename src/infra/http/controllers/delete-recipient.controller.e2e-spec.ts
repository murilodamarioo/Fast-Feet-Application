import { JwtService } from '@nestjs/jwt'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { AdminFactory } from 'test/factories/make-admin'
import { CourierFactory } from 'test/factories/make-courier'
import { RecipientFactory } from 'test/factories/make-recipient'

import request from 'supertest'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Delete recipient (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let courierFactory: CourierFactory
  let recipientFactory: RecipientFactory
  let jwt: JwtService
  let prisma: PrismaService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, CourierFactory, RecipientFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)
    courierFactory = moduleRef.get(CourierFactory)
    recipientFactory = moduleRef.get(RecipientFactory)

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[DELETE] /recipients/:id', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()
    const recipientId = recipient.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/recipients/${recipientId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(204)

    const recipientOnDatabase = await prisma.recipient.findUnique({
      where: {
        id: recipientId
      }
    })

    expect(recipientOnDatabase).toBeFalsy()
  })

  test('[DELETE] /recipients/:id - Forbidden', async () => {
    const courier = await courierFactory.makePrismaCourier()
    const accessToken = jwt.sign({ sub: courier.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()
    const recipientId = recipient.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/recipients/${recipientId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(403)
  })
})
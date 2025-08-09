import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { DatabaseModule } from '@/infra/database/database.module'
import { AppModule } from '@/infra/app.module'

import { AdminFactory } from 'test/factories/make-admin'
import { RecipientFactory } from 'test/factories/make-recipient'
import { CourierFactory } from 'test/factories/make-courier'

import request from 'supertest'

describe('Edit recipient (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let courierFactory: CourierFactory
  let recpientFactory: RecipientFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, CourierFactory, RecipientFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)
    courierFactory = moduleRef.get(CourierFactory)
    recpientFactory = moduleRef.get(RecipientFactory)

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /recpients/:id', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const recipient = await recpientFactory.makePrismaRecipient()
    const recpientId = recipient.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/recpients/${recpientId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        zipCode: 'NW1 6XE',
        address: '221B Baker Street',
        neighborhood: 'Marylebone',
        state: 'London'
      })

    expect(response.status).toBe(200)

    const recipientOnDatabase = await prisma.recipient.findUnique({
      where: {
        id: recpientId
      }
    })

    expect(recipientOnDatabase).toMatchObject({
      name: 'John Doe',
      cpf: recipient.cpf,
      email: 'johndoe@gmail.com',
      phone: recipient.phone,
      zipCode: 'NW1 6XE',
      address: '221B Baker Street',
      neighborhood: 'Marylebone',
      state: 'London'
    })
  })

  test('[PUT] /recpients/:id - Forbidden', async () => {
    const courier = await courierFactory.makePrismaCourier()
    const accessToken = jwt.sign({ sub: courier.id.toString() })

    const recipient = await recpientFactory.makePrismaRecipient()
    const recpientId = recipient.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/recpients/${recpientId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        zipCode: 'NW1 6XE',
        address: '221B Baker Street',
        neighborhood: 'Marylebone',
        state: 'London'
      })

    expect(response.status).toBe(403)
  })
})
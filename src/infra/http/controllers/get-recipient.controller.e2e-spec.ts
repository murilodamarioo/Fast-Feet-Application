import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { INestApplication } from '@nestjs/common'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { CourierFactory } from 'test/factories/make-courier'
import { RecipientFactory } from 'test/factories/make-recipient'

import request from 'supertest'

describe('Get recipient (E2E)', () => {
  let app: INestApplication
  let courierFactory: CourierFactory
  let recipientFactory: RecipientFactory
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory, RecipientFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    courierFactory = moduleRef.get(CourierFactory)
    recipientFactory = moduleRef.get(RecipientFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /recipients/:id', async () => {
    const courier = await courierFactory.makePrismaCourier()
    const accessToken = jwt.sign({ sub: courier.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const response = await request(app.getHttpServer())
      .get(`/recipients/${recipient.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    console.log(JSON.stringify(response.body))

    expect(response.status).toBe(200)
    expect(response.body.response.value.recipient.props).toEqual({
      name: recipient.name,
      email: recipient.email,
      cpf: recipient.cpf,
      phone: recipient.phone,
      zipCode: recipient.zipCode,
      address: recipient.address,
      neighborhood: recipient.neighborhood,
      state: recipient.state
    })
  })
})
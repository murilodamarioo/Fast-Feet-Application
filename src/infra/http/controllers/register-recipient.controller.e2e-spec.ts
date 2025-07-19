import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { AdminFactory } from 'test/factories/make-admin'

import request from 'supertest'
import { CourierFactory } from 'test/factories/make-courier'

describe('Register recipient (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let courierFactory: CourierFactory
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, CourierFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = await moduleRef.get(AdminFactory)
    courierFactory = await moduleRef.get(CourierFactory)
    jwt = await moduleRef.get(JwtService)

    app.init()
  })

  test('[POST] /register/recipient', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/register/recipient')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        cpf: '1234567890',
        email: 'johndoe@gmail.com',
        phone: '(11)953423455',
        zipCode: 'NW1 6XE',
        address: '221B Baker Street',
        neighborhood: 'Marylebone',
        state: 'London'
      })

    expect(response.status).toBe(201)
    expect(response.body.recipient.recipient.props).toEqual({
      name: 'John Doe',
      cpf: '1234567890',
      email: 'johndoe@gmail.com',
      phone: '(11)953423455',
      zipCode: 'NW1 6XE',
      address: '221B Baker Street',
      neighborhood: 'Marylebone',
      state: 'London',
      latitude: expect.any(Number),
      longitude: expect.any(Number)
    })
  })

  test('[POST] /register/recipient - Forbidden', async () => {
    const courier = await courierFactory.makePrismaCourier()
    const accessToken = await jwt.sign({ sub: courier.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/register/recipient')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        cpf: '1234567890',
        email: 'johndoe@gmail.com',
        phone: '(11)953423455',
        zipCode: 'NW1 6XE',
        address: '221B Baker Street',
        neighborhood: 'Marylebone',
        state: 'London'
      })

    expect(response.status).toBe(403)
  })
})
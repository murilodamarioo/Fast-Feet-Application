import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { compare, hash } from 'bcryptjs'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DatabaseModule } from '@/infra/database/database.module'

import { AdminFactory } from 'test/factories/make-admin'
import { CourierFactory } from 'test/factories/make-courier'

import request from 'supertest'

describe('Change courier password (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let courierFactory: CourierFactory
  let jwt: JwtService
  let prisma: PrismaService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, CourierFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    courierFactory = moduleRef.get(CourierFactory)

    await app.init()
  })

  test('[PUT] /courier/:courierId/change-password', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const courier = await courierFactory.makePrismaCourier({
      password: await hash('12345', 8)
    })
    const courierId = courier.id.toString()

    const newPassword = 'w7r23r%fyq2@'
    
    const response = await request(app.getHttpServer())
      .put(`/courier/${courierId}/change-password`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: newPassword
      })

    expect(response.statusCode).toBe(200)

    const courierOnDatabase = await prisma.user.findUnique({
      where: {
        id: courierId
      }
    })

    const passwordMatches = await compare(newPassword, courierOnDatabase!.password)
    
    expect(passwordMatches).toBeTruthy()
  })

  test('[PUT] /courier/:courierId/change-password - Forbidden', async () => {
    const courier = await courierFactory.makePrismaCourier()
    const courierId = courier.id.toString()

    const accessToken = jwt.sign({ sub: courier.id.toString() })

    const newPassword = 'w7r23r%fyq2@'

    const response = await request(app.getHttpServer())
      .put(`/courier/${courierId}/change-password`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: newPassword
      })

    expect(response.statusCode).toBe(403)
  })
})
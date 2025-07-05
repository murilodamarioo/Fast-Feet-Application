import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { AdminFactory } from 'test/factories/make-admin'

import request from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { compare, hash } from 'bcryptjs'

describe('Change Admin password (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let jwt: JwtService
  let prisma: PrismaService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  it ('[PUT] /admin/change-password', async () => {
    const admin = await adminFactory.makePrismaAdmin({
      password: await hash('12345', 8)
    })

    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const newPassword = 'Qjbcuw@wo_123'

    const response = await request(app.getHttpServer())
      .put('/admin/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: newPassword
      })

    expect(response.statusCode).toBe(200)

    const adminOnDatabase = await prisma.user.findUnique({
      where: {
        id: admin.id.toString()
      }
    })

    expect(adminOnDatabase).not.toBeNull()

    const passwordMatches = await compare(newPassword, adminOnDatabase!.password)

    expect(passwordMatches).toBeTruthy()
  })
})
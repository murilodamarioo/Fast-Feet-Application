import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { Body, Controller, HttpCode, Post, UseGuards, UsePipes } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { z } from 'zod'


const createOrderBodySchema = z.object({
  orderName: z.string(),
  recipientId: z.string().uuid(),
  courierId: z.string().uuid()
})

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>

@Controller('/order')
@UseGuards(AuthGuard('jwt'))
export class CreateOrderController {

  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createOrderBodySchema))
  async handle(@Body() body: CreateOrderBodySchema) {
    const { orderName, courierId, recipientId } = body

    await this.prisma.order.create({
      data: {
        title: orderName,
        courierId,
        recipientId
      }
    })
  }

}
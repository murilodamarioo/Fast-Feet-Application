import { BadRequestException, Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'

import { RecipientNotFoundError } from '@/core/errors/errors/recipient-not-found-error'

import { CreateOrderUseCase } from '@/domain/delivery/application/uses-cases/create-order'

import { Roles } from '@/infra/permission/roles.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'


const createOrderBodySchema = z.object({
  orderName: z.string(),
  recipientId: z.string().uuid(),
  courierId: z.string().uuid()
})

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>

@Controller('/order')
export class CreateOrderController {

  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles(['ADMIN'])
  @UsePipes(new ZodValidationPipe(createOrderBodySchema))
  async handle(@Body() body: CreateOrderBodySchema) {
    const { orderName, courierId, recipientId } = body

    const response = await this.createOrder.execute({
      recipientId,
      courierId,
      orderName
    })

    if (response.isFailure()) {
      const error = response.value
      
      switch (error.constructor) {
        case RecipientNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }

}
import { BadRequestException, Body, Controller, HttpCode, Post, UseGuards, UsePipes } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger'

import { z } from 'zod'

import { RecipientNotFoundError } from '@/core/errors/errors/recipient-not-found-error'

import { CreateOrderUseCase } from '@/domain/delivery/application/uses-cases/create-order'

import { CheckRoles } from '@/infra/permission/roles.decorator'
import { RolesGuard } from '@/infra/permission/roles.guard'
import { Action, AppAbility } from '@/infra/permission/ability.factory'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'



const createOrderBodySchema = z.object({
  orderName: z.string(),
  recipientId: z.string().uuid(),
  courierId: z.string().uuid()
})

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>

@ApiBearerAuth()
@ApiTags('order')
@Controller('/order')
export class CreateOrderController {

  constructor(private createOrder: CreateOrderUseCase) { }

  @Post()
  @HttpCode(201)
  @UseGuards(RolesGuard)
  @CheckRoles((ability: AppAbility) => ability.can(
    Action.CREATE, 'Order'
  ))
  @UsePipes(new ZodValidationPipe(createOrderBodySchema))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        orderName: { type: 'string', example: 'Order 01' },
        courierId: { type: 'string', example: 'a1b2c3d4-e5f6-7g8h-9i10-j11k12l13m14' },
        recipientId: { type: 'string', example: 'a1b2c3d4-e5f6-7g8h-9i10-j11k12l13m14' }
      }
    }
  })
  @ApiCreatedResponse({ description: 'Order created' })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Recipient not found' }
      }
    }
  })
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
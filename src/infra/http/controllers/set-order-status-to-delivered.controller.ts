import { BadRequestException, Body, Controller, HttpCode, InternalServerErrorException, Param, Put, UseGuards } from '@nestjs/common'

import { z } from 'zod'

import { PhotoNotProvidedError } from '@/core/errors/errors/photo-not-provided-error'
import { OrderDeliveryDistanceTooFarError } from '@/core/errors/errors/order-delivery-distance-too-far-error'
import { SetOrderStatusError } from '@/core/errors/errors/set-order-status-error'

import { SetOrderStatusToDeliveredUseCase } from '@/domain/delivery/application/uses-cases/set-order-status-to-delivered'

import { RolesGuard } from '@/infra/permission/roles.guard'
import { CheckRoles } from '@/infra/permission/roles.decorator'
import { Action, AppAbility } from '@/infra/permission/ability.factory'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ApiBadRequestResponse, ApiBearerAuth, ApiNoContentResponse, ApiParam, ApiTags } from '@nestjs/swagger'

const deliverOrderBodySchema = z.object({
  photoId: z.string(),
  latitude: z.number().refine(value => {
    return Math.abs(value) <= 90
  }),
  longitude: z.number().refine(value => {
    return Math.abs(value) <= 180
  })
})

type DeliverOrderBodySchema = z.infer<typeof deliverOrderBodySchema>

const bodyValidationPipe = new ZodValidationPipe(deliverOrderBodySchema)

@ApiBearerAuth()
@ApiTags('order')
@Controller('/orders/:id/deliver')
export class SetOrderStatusToDeliveredController {

  constructor(private setOrderStatusToDelivered: SetOrderStatusToDeliveredUseCase) { }

  @Put()
  @HttpCode(204)
  @UseGuards(RolesGuard)
  @CheckRoles((ability: AppAbility) =>
    ability.can(Action.DELIVER, 'Order')
  )
  @ApiParam({
    name: 'id',
    description: 'Order Id',
    type: 'string',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
  })
  @ApiNoContentResponse({ description: 'Order status successfully delivered' })
  @ApiBadRequestResponse({
    description: 'Invalid request',
    content: {
      'application/json': {
        examples: {
          SetOrderStatusError: {
            summary: 'Cannot change status',
            value: {
              statusCode: 400,
              message: 'Impossible to change order status from DELIVERED to PENDING',
            },
          },
          OrderDeliveryDistanceTooFarError: {
            summary: 'Order too far',
            value: {
              statusCode: 400,
              message: 'Delivery cannot be completed: the distance to the recipient exceeds the allowed limit.',
            },
          },
          PhotoNotProvidedError: {
            summary: 'Photo missing',
            value: {
              statusCode: 400,
              message: 'Photo is required',
            },
          },
        },
      },
    },
  })
  async handle(
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: DeliverOrderBodySchema,
  ) {
    const { photoId, latitude, longitude } = body

    const response = await this.setOrderStatusToDelivered.execute({
      orderId: id,
      photoId,
      orderLatitude: latitude,
      orderLongitude: longitude
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case SetOrderStatusError:
          throw new BadRequestException(error.message)
        case OrderDeliveryDistanceTooFarError:
          throw new BadRequestException(error.message)
        case PhotoNotProvidedError:
          throw new BadRequestException(error.message)
        default:
          throw new InternalServerErrorException(error.message)
      }
    }
  }
}
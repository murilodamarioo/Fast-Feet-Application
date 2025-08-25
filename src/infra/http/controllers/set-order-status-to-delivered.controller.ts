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

@Controller('/orders/:id/deliver')
export class SetOrderStatusToDeliveredController {

  constructor(private setOrderStatusToDelivered: SetOrderStatusToDeliveredUseCase) { }

  @Put()
  @HttpCode(204)
  @UseGuards(RolesGuard)
  @CheckRoles((ability: AppAbility) =>
    ability.can(Action.DELIVER, 'Order')
  )
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
import { BadRequestException, Body, Controller, HttpCode, Param, Put, UseGuards } from '@nestjs/common'
import z from 'zod'

import { CourierNotFoundError } from '@/core/errors/errors/courier-not-found-error'
import { ChangeCourierPasswordUseCase } from '@/domain/delivery/application/uses-cases/change-courier-password'
import { CheckRoles } from '@/infra/permission/roles.decorator'
import { RolesGuard } from '@/infra/permission/roles.guard'
import { Action, AppAbility } from '@/infra/permission/ability.factory'

const changeCourierPasswordBodySchema = z.object({
  password: z.string()
})

type ChangeCourierPasswordBodySchema = z.infer<typeof changeCourierPasswordBodySchema>

@Controller('/courier/:courierId/change-password')
export class ChangeCourierPasswordController {

  constructor(private changeCourierPassword: ChangeCourierPasswordUseCase) { }

  @Put()
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @CheckRoles((ability: AppAbility) =>
    ability.can(Action.UPDATE, 'Courier')
  )
  async handle(
    @Body() body: ChangeCourierPasswordBodySchema,
    @Param('courierId') courierId: string
  ) {
    const { password } = body

    const response = await this.changeCourierPassword.execute({
      newPassword: password,
      courierId
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case CourierNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
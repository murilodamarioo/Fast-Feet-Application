import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Param, Put, UseGuards } from '@nestjs/common'
import z from 'zod'

import { CourierNotFoundError } from '@/core/errors/errors/courier-not-found-error'
import { ChangeCourierPasswordUseCase } from '@/domain/delivery/application/uses-cases/change-courier-password'
import { CheckRoles } from '@/infra/permission/roles.decorator'
import { RolesGuard } from '@/infra/permission/roles.guard'
import { Action, AppAbility } from '@/infra/permission/ability.factory'
import { ApiBearerAuth, ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

const changeCourierPasswordBodySchema = z.object({
  password: z.string()
})

type ChangeCourierPasswordBodySchema = z.infer<typeof changeCourierPasswordBodySchema>

@ApiBearerAuth()
@ApiTags('accounts')
@Controller('/courier/:courierId/change-password')
export class ChangeCourierPasswordController {

  constructor(private changeCourierPassword: ChangeCourierPasswordUseCase) { }

  @Put()
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @CheckRoles((ability: AppAbility) =>
    ability.can(Action.UPDATE, 'Courier')
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: { type: 'string', example: 'newP@ssw0rd' }
      },
      required: ['password']
    }
  })
  @ApiOkResponse({ description: 'Password has changed successfully' })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Courier not found' }
      }
    }
  })
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
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
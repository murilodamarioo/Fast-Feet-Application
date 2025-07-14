import { BadRequestException, Body, Controller, HttpCode, Param, Put } from '@nestjs/common'
import z from 'zod'

import { CourierNotFoundError } from '@/core/errors/errors/courier-not-found-error'
import { ChangeCourierPasswordUseCase } from '@/domain/delivery/application/uses-cases/change-courier-password'
import { Roles } from '@/infra/permission/roles.decorator'

const changeCourierPasswordBodySchema = z.object({
  password: z.string()
})

type ChangeCourierPasswordBodySchema = z.infer<typeof changeCourierPasswordBodySchema>

@Controller('/courier/:courierId/change-password')
export class ChangeCourierPasswordController {

  constructor(private changeCourierPassword: ChangeCourierPasswordUseCase) {}

  @Put()
  @Roles(['ADMIN'])
  @HttpCode(200)
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
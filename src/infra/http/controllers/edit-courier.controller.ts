import { BadRequestException, Body, Controller, HttpCode, Param, Put, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

import { CourierNotFoundError } from '@/core/errors/errors/courier-not-found-error'
import { EditCourierUseCase } from '@/domain/delivery/application/uses-cases/edit-courier'

const editCourierBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  email: z.string()
})

type EditCourierBodySchema = z.infer<typeof editCourierBodySchema>

@Controller('/accounts/courier/:id')
export class EditCourierController {

  constructor(private editCourier: EditCourierUseCase) {}

  @Put()
  @HttpCode(200)
  async handle(
    @Body() body: EditCourierBodySchema,
    @Param('id') id: string
  ) {
    const { name, cpf, email } = body

    const response = await this.editCourier.execute({
      courierId: id,
      name,
      cpf,
      email
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
import { RecipientNotFoundError } from '@/core/errors/errors/recipient-not-found-error'
import { EditRecipientUseCase } from '@/domain/delivery/application/uses-cases/edit-recipient'
import { Roles } from '@/infra/permission/roles.decorator'
import { BadRequestException, Body, Controller, HttpCode, InternalServerErrorException, Param, Put } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editRecipientBodySchema = z.object({
  name: z.string().optional(),
  cpf: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  zipCode: z.string().optional(),
  address: z.string().optional(),
  neighborhood: z.string().optional(),
  state: z.string().optional()
})

type EditRecipientBodySchema = z.infer<typeof editRecipientBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editRecipientBodySchema)

@Controller('/recpients/:id')
export class EditRecipientController {

  constructor(private editRecipient: EditRecipientUseCase) { }

  @Put()
  @HttpCode(200)
  @Roles(['ADMIN'])
  async handle(
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: EditRecipientBodySchema
  ) {
    const { name, email, cpf, phone, zipCode, address, neighborhood, state } = body

    const response = await this.editRecipient.execute({
      recipientId: id,
      name,
      email,
      cpf,
      phone,
      zipCode,
      address,
      neighborhood,
      state
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case RecipientNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new InternalServerErrorException(error.message)
      }
    }
  }

}
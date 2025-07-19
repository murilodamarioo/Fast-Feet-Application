import { RegisterRecipientUseCase } from '@/domain/delivery/application/uses-cases/register-recipient'
import { BadRequestException, Body, Controller, HttpCode, InternalServerErrorException, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { RecipientAlreadyExistsError } from '@/core/errors/errors/recipient-already-exists-error'
import { Roles } from '@/infra/permission/roles.decorator'

const registerRecipientBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  email: z.string().email(),
  phone: z.string(),
  zipCode: z.string(),
  address: z.string(),
  neighborhood: z.string(),
  state: z.string()
})

type RegisterRecipientBodySchema = z.infer<typeof registerRecipientBodySchema>

@Controller('/register/recipient')
export class RegisterRecipientController {

  constructor(private registerRecipient: RegisterRecipientUseCase) { }

  @Post()
  @HttpCode(201)
  @Roles(['ADMIN'])
  @UsePipes(new ZodValidationPipe(registerRecipientBodySchema))
  async handle(@Body() body: RegisterRecipientBodySchema) {
    const { name, cpf, email, phone, zipCode, address, neighborhood, state } = body

    const response = await this.registerRecipient.execute({
      name,
      cpf,
      email,
      phone,
      zipCode,
      address,
      neighborhood,
      state
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case RecipientAlreadyExistsError:
          throw new BadRequestException(error.message)
        default:
          throw new InternalServerErrorException(error.message)
      }
    }

    return { recipient: response.value }
  }
}
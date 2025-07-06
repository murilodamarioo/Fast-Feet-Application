import { Controller, HttpCode, Post, UsePipes, Body, BadRequestException, ConflictException } from '@nestjs/common'

import { z } from 'zod'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

import { UserAlreadyExistsError } from '@/core/errors/errors/user-already-exists-error'
import { RegisterCourierUseCase } from '@/domain/delivery/application/uses-cases/register-courier'

const createCourierAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  cpf: z.string(),
  password: z.string()
})

type CreateCourierAccountBodySchema = z.infer<typeof createCourierAccountBodySchema>

@Controller('/accounts/courier')
export class CreateCourierAccountController {

  constructor(private registerCourier: RegisterCourierUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createCourierAccountBodySchema))
  async handle(@Body() body: CreateCourierAccountBodySchema) {
    const { name, email, cpf, password } = body

    const response = await this.registerCourier.execute({
      name,
      email,
      cpf,
      password
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
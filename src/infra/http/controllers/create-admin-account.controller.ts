import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UseGuards, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { RegisterAdminUseCase } from '@/domain/delivery/application/uses-cases/register-admin'
import { UserAlreadyExistsError } from '@/core/errors/errors/user-already-exists-error'
import { Public } from '@/infra/auth/public'
import { ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';


const createAdminAccountBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  email: z.string().email(),
  password: z.string()
})

type CreateAccountBodySchema = z.infer<typeof createAdminAccountBodySchema>

@ApiBearerAuth()
@ApiTags('accounts')
@Controller('/accounts/admin')
@Public()
export class CreateAdminAccountController {

  constructor(private registerAdmin: RegisterAdminUseCase) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAdminAccountBodySchema))
  @ApiBody({
    schema: {
      properties: {
        name: { type: 'string', example: 'John Doe' },
        cpf: { type: 'string', example: '12345678910' },
        email: { type: 'string', example: 'john@gmail.com' },
        password: { type: 'string', example: 'P@ssw0rd' }
      },
      required: ['name', 'cpf', 'email', 'password']
    }
  })
  @ApiCreatedResponse({ description: 'Admin created successfully' })
  @ApiConflictResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User with the same CPF already exists' }
      }
    }
  })
  async handle(@Body() body: CreateAccountBodySchema) {

    const { name, cpf, email, password } = body

    const response = await this.registerAdmin.execute({
      cpf,
      email,
      name,
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
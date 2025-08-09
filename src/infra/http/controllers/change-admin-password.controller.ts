import z from 'zod'
import { BadRequestException, Body, Controller, HttpCode, Put, UnauthorizedException, UseGuards } from '@nestjs/common'

import { ChangeAdminPasswordUseCase } from '@/domain/delivery/application/uses-cases/change-admin-password'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { AdminNotFoundError } from '@/core/errors/errors/admin-not-found-error'

const changeAdminPasswordBodySchema = z.object({
  password: z.string()
})

type ChangeAdminPasswordBodySchema = z.infer<typeof changeAdminPasswordBodySchema>

@Controller('/accounts/admin/change-password')
export class ChangeAdminPasswordController {

  constructor(private changeAdminPassword: ChangeAdminPasswordUseCase) { }

  @Put()
  @HttpCode(200)
  async handle(
    @Body() body: ChangeAdminPasswordBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const adminId = user.sub

    const { password } = body

    const response = await this.changeAdminPassword.execute({
      newPassword: password,
      adminId
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case AdminNotFoundError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }

}
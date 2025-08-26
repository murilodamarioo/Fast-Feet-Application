import { BadRequestException, Body, Controller, HttpCode, Put, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'

import z from 'zod'

import { AdminNotFoundError } from '@/core/errors/errors/admin-not-found-error'

import { ChangeAdminPasswordUseCase } from '@/domain/delivery/application/uses-cases/change-admin-password'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CheckRoles } from '@/infra/permission/roles.decorator'
import { Action, AppAbility } from '@/infra/permission/ability.factory'

const changeAdminPasswordBodySchema = z.object({
  password: z.string()
})

type ChangeAdminPasswordBodySchema = z.infer<typeof changeAdminPasswordBodySchema>

ApiBearerAuth()
@ApiTags('accounts')
@Controller('/accounts/admin/change-password')
export class ChangeAdminPasswordController {

  constructor(private changeAdminPassword: ChangeAdminPasswordUseCase) { }

  @Put()
  @HttpCode(200)
  @UseGuards()
  @CheckRoles((ability: AppAbility) =>
    ability.can(Action.UPDATE, 'Admin')
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: { type: 'string', example: 'newP@ssw0rd' }
      },
      required: ['password']
    },
  })
  @ApiOkResponse({ description: 'Password has changed successfully' })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Admin not found' }
      }
    }
  })
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
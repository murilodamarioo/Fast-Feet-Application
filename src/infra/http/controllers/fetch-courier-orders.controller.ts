import { BadRequestException, Controller, Get, HttpCode, InternalServerErrorException, Param, Query, UnauthorizedException, UseGuards } from '@nestjs/common'

import { FetchCourierOrdersByStatusUseCase } from '@/domain/delivery/application/uses-cases/fetch-courier-orders-by-status'

import { z } from 'zod'

import { CourierNotFoundError } from '@/core/errors/errors/courier-not-found-error'
import { success } from '@/core/either'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { OrderPresenter } from '../presenters/order-presenter'
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { RolesGuard } from '@/infra/permission/roles.guard'
import { CheckRoles } from '@/infra/permission/roles.decorator'
import { Action, AppAbility } from '@/infra/permission/ability.factory'

const pageQueryParamSchema = z
  .object({
    page: z
      .string()
      .optional()
      .default('1')
      .transform(Number)
      .pipe(z.number().min(1)),
  })
  .default({})

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiBearerAuth()
@ApiTags('order')
@Controller('/courier/orders/:status')
export class FetchCourierOrdersController {

  constructor(private fetchCourierOrders: FetchCourierOrdersByStatusUseCase) { }

  @Get()
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @CheckRoles((ability: AppAbility) =>
    ability.can(Action.READ, 'Order')
  )
  @ApiParam({
    name: 'status',
    description: 'Order status',
    type: 'string',
    example: 'pending'
  })
  @ApiOkResponse({
    description: 'List of courier orders',
    schema: {
      type: 'object',
      properties: {
        orders: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              orderName: { type: 'string' },
              status: { type: 'string' },
              postedAt: { type: 'string', format: 'date-time' },
            },
          },
          example: [
            {
              id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
              orderName: 'Order #123 - Electronics',
              status: 'Delivred',
              postedAt: '2025-08-20T10:15:30.000Z',
            },
            {
              id: 'b2c3d4e5-f6a1-8901-2345-67890abcdef1',
              orderName: 'Order #124 - Books',
              status: 'Delivered',
              postedAt: '2025-08-21T09:00:00.000Z',
            },
          ],
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Courier not found' }
      }
    }
  })
  async handle(
    @Query(queryValidationPipe) query: PageQueryParamSchema,
    @Param('status') status: string,
    @CurrentUser() user: UserPayload
  ) {
    const userId = user.sub
    const page = query.page

    const response = await this.fetchCourierOrders.execute({
      courierId: userId,
      status,
      page
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case CourierNotFoundError:
          throw new UnauthorizedException(error.message)
        default:
          throw new InternalServerErrorException(error.message)
      }
    }

    const orders = response.value.orders

    return success({ orders: orders.map(OrderPresenter.toHTTP) })
  }

}
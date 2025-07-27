import { FetchCourierOrdersByStatusUseCase } from '@/domain/delivery/application/uses-cases/fetch-courier-orders-by-status'
import { BadRequestException, Controller, Get, HttpCode, InternalServerErrorException, Param, Query } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CourierNotFoundError } from '@/core/errors/errors/courier-not-found-error'
import { success } from '@/core/either'
import { OrderPresenter } from '../presenters/order-presenter'

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

@Controller('/courier/orders/:status')
export class FetchCourierOrdersController {

  constructor(private fetchCourierOrders: FetchCourierOrdersByStatusUseCase) { }

  @Get()
  @HttpCode(200)
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
          throw new BadRequestException(error.message)
        default:
          throw new InternalServerErrorException(error.message)
      }
    }

    const orders = response.value.orders

    return success({ orders: orders.map(OrderPresenter.toHTTP) })
  }

}
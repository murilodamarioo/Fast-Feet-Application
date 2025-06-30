import { Injectable } from '@nestjs/common'

import { OrdersRepository } from '@/domain/delivery/application/repositories/orders-repository'
import { Order } from '@/domain/delivery/enterprise/entities/Order'
import { OrderDetails } from '@/domain/delivery/enterprise/entities/value-object.ts/order-details'
import { PrismaService } from '../prisma.service'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {

  constructor(private prisma: PrismaService) {}
  
  async findById(id: string): Promise<Order | null> {
    throw new Error('Method not implemented.')
  }
  
  async findOrderDetailsById(id: string): Promise<OrderDetails | null> {
    throw new Error('Method not implemented.')
  }
  
  findManyByStatus(courierId: string, status: string): Promise<Order[]> {
    throw new Error('Method not implemented.')
  }
  
  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.create({
      data
    })
  }
  
  async save(order: Order): Promise<void> {
    throw new Error('Method not implemented.')
  }
  
  async updateStatus(order: Order): Promise<void> {
    throw new Error('Method not implemented.')
  }
  
}
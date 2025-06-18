import { CouriersRepository } from '@/domain/delivery/application/repositories/couriers-repository'
import { Courier } from '@/domain/delivery/enterprise/entities/Courier'

export class InMemoryCourierRepository extends CouriersRepository {

  public couriers: Courier[] = []
  
  async findByCpf(cpf: string): Promise<Courier | null> {
    const courier = this.couriers.find(courier => courier.cpf === cpf)

    return courier ? courier : null
  }

  async findById(id: string): Promise<Courier | null> {
    const courier = this.couriers.find(courier => courier.id.toString()=== id)

    return courier ? courier : null
  }

  async create(courier: Courier): Promise<void> {
    this.couriers.push(courier)
  }

  async save(courier: Courier): Promise<void> {
    const itemIndex = this.couriers.findIndex((item) => item.id === courier.id)

    this.couriers[itemIndex] = courier
  }

  async delete(id: string): Promise<void> {
    const itemIndex = this.couriers.findIndex(courier => courier.id.toString() === id)
    
    this.couriers.splice(itemIndex, 1)
  }

}
import { Courier } from '@/domain/delivery/enterprise/entities/Courier'


export class CourierPresenter {

  static toHTTP(courier: Courier) {
    return {
      id: courier.id.toString(),
      name: courier.name,
      email: courier.email,
      cpf: courier.cpf
    }
  }

}
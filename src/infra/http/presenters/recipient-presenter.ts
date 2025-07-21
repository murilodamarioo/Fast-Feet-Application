import { Recipient } from '@/domain/delivery/enterprise/entities/Recipient'

export class RecipientPresenter {

  static toHTTP(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      email: recipient.email,
      cpf: recipient.cpf,
      phone: recipient.phone,
      zipCode: recipient.zipCode,
      address: recipient.address,
      neighborhood: recipient.neighborhood,
      state: recipient.state
    }
  }

}
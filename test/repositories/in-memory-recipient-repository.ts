import { RecipientsRepository } from "@/domain/delivery/application/repositories/recipients-repository"
import { Recipient } from "@/domain/delivery/enterprise/entities/Recipient"

export class InMemoryRecipientRepository extends RecipientsRepository {
  
  public recipients: Recipient[] = []

  async findByEmail(email: string): Promise<Recipient | null> {
    const recipient = this.recipients.find(recipient => recipient.email === email)

    return recipient ? recipient : null
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = this.recipients.find((recipient) => recipient.id.toString() === id)

    return recipient ? recipient : null
  }

  async create(recipient: Recipient): Promise<void> {
    this.recipients.push(recipient)
  }

  async save(recipient: Recipient): Promise<void> {
    const itemIndex = this.recipients.findIndex((item) => item.id === recipient.id)

    this.recipients[itemIndex] = recipient
  }

  async delete(id: string): Promise<void> {
    const itemIndex = this.recipients.findIndex((item) => item.id.toString() === id)

    this.recipients.splice(itemIndex, 1)
  }
}
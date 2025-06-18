import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface RecipientProps {
  // Personal data
  name: string
  cpf: string
  email: string
  
  // Contact info
  phone: string

  // Adress info
  zipCode: string
  address: string
  neighborhood: string
  state: string
  latitude: number
  longitude: number
}

export class Recipient extends Entity<RecipientProps> {

  // Personal data Getters and Setters
  get name(): string { return this.props.name }
  set name(name: string) { this.props.name = name }

  get cpf(): string { return this.props.cpf }
  set cpf(cpf: string) { this.props.cpf = cpf }

  get email(): string { return this.props.email }
  set email(email: string) { this.props.email = email }

  // Contact info Getters and Setters
  get phone(): string { return this.props.phone }
  set phone(phone: string) { this.props.phone = phone }

  // Adress info Getters and Setters
  get zipCode(): string { return this.props.zipCode }
  set zipCode(zipCode: string) { this.props.zipCode = zipCode }

  get address(): string { return this.props.address }
  set address(address: string) { this.props.address = address }

  get neighborhood(): string { return this.props.neighborhood }
  set neighborhood(neighborhood: string) { this.props.neighborhood = neighborhood }

  get state(): string { return this.props.state }
  set state(state: string) { this.props.state = state }

  get latitude(): number { return this.props.latitude }
  set latitude(latitude: number) { this.props.latitude = latitude }

  get longitude(): number { return this.props.longitude }
  set longitude(longitude: number) { this.props.longitude = longitude }

  /**
   * Creates a new instance of Recipient.
   *
   * @param {RecipientProps} props - Object containing the recipient's properties.
   * @param {UniqueEntityId} [id] - Unique ID of the recipient (optional).
   * @returns {Recipient} Created recipient instance.
  */
  static create(props: RecipientProps, id?: UniqueEntityId): Recipient {
    const recipient = new Recipient(props, id)
    
    return recipient
  }

}
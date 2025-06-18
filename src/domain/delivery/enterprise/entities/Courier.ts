import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface CourierProps {
  name: string
  cpf: string
  email: string
  password: string
}

export class Courier extends Entity<CourierProps> {

  get name(): string { return this.props.name }
  set name(name: string) { this.props.name = name }

  get cpf(): string { return this.props.cpf }
  set cpf(cpf: string) { this.props.cpf = cpf }

  get email(): string { return this.props.email }
  set email(email: string) { this.props.email = email }

  get password(): string { return this.props.password }
  set password(password: string) { this.props.password = password }


  /**
   * Creates a new instance of Courier.
   *
   * @param {CourierProps} props - Object containing the courier's properties.
   * @param {UniqueEntityId} [id] - Unique ID of the courier (optional).
   * @returns {Courier} Created courier instance.
   */
  static create(props: CourierProps, id?: UniqueEntityId): Courier {
    const courier = new Courier(props, id)

    return courier
  }
}
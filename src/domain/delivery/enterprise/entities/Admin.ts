import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface AdminProps {
  name: string
  cpf: string
  email: string
  password: string
}

export class Admin extends Entity<AdminProps> {

  get name(): string { return this.props.name }
  set name(name: string) { this.props.name = name }

  get cpf(): string { return this.props.cpf }
  set cpf(cpf: string) { this.props.cpf = cpf }

  get email(): string { return this.props.email }
  set email(email: string) { this.props.email = email }

  get password(): string { return this.props.password }
  set password(password: string) { this.props.password = password }

  /**
   * Creates a new instance of Admin.
   *
   * @param {AdminProps} props - Object containing the admin's properties.
   * @param {UniqueEntityId} [id] - Unique ID of the admin (optional).
   * @returns {Admin} Created admin instance.
   */
  static create(props: AdminProps, id?: UniqueEntityId): Admin {
    const admin  = new Admin(props, id)

    return admin
  }
}
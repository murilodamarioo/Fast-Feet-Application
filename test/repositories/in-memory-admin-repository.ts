import { AdminRepository } from '@/domain/delivery/application/repositories/admin-repository'
import { Admin } from '@/domain/delivery/enterprise/entities/Admin';

export class InMemoryAdminRepository extends AdminRepository {

  public admins: Admin[] = []

  async findByCpf(cpf: string): Promise<Admin | null> {
    const admin = this.admins.find(admin => admin.cpf === cpf)

    return admin ? admin : null
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = this.admins.find(admin => admin.id.toString() === id)

    return admin ? admin : null
  }
  
  async create(admin: Admin): Promise<void> {
    this.admins.push(admin)
  }

  async save(admin: Admin): Promise<void> {
    const adminIndex = this.admins.findIndex((item) => item.id === admin.id)

    this.admins[adminIndex] = admin
  }

}
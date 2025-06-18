import { Admin } from "@/domain/delivery/enterprise/entities/Admin";

export abstract class AdminRepository {

  /**
   * Finds an Admin entity by CPF.
   *
   * @param {string} cpf - The CPF of the Admin to find.
   * @returns {Promise<Admin | null>} A promise that resolves with the Admin entity if found, or null if not found.
   */
  abstract findByCpf(cpf: string): Promise<Admin | null>

  /**
   * Finds an Admin entity by ID.
   *
   * @param {string} id - The ID of the Admin to find.
   * @returns {Promise<Admin | null>} A promise that resolves with the Admin entity if found, or null if not found.
   */
  abstract findById(id: string): Promise<Admin | null>

  /**
   * Create a new Admin.
   *
   * @param {Admin} admin - The Admin entity to be created.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  abstract create(admin: Admin): Promise<void>

  /**
   * Saves an Admin entity.
   *
   * @param {Admin} admin - The Admin entity to be saved.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  abstract save(admin: Admin): Promise<void>

}
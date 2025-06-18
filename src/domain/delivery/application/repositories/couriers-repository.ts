import { Courier } from '@/domain/delivery/enterprise/entities/Courier'

export abstract class CouriersRepository {

  /**
   * Retrieves a courier by its CPF.
   * 
   * @param {string} cpf - The CPF of the courier to be retrieved.
   * @returns {Promise<Courier | null>} A promise that resolves with the found courier, or null if not found.
   */
  abstract findByCpf(cpf: string): Promise<Courier | null>

  /**
   * Retrieves a courier by its ID.
   * 
   * @param {string} id - The ID of the courier to be retrieved.
   * @returns {Promise<Courier | null>} A promise that resolves with the found courier, or null if not found.
   */
  abstract findById(id: string): Promise<Courier | null>
  
  /**
   * Creates a new courier.
   * 
   * @param {Courier} courier The courier to be created.
   * @returns {Promise<void>} A promise that resolves with void after the courier creation.
   */
  abstract create(courier: Courier): Promise<void>

  /**
   * Updates an existing courier or saves changes to a courier.
   * 
   * @param {Courier} courier - The courier entity with updated information to be saved.
   * @returns {Promise<Courier>} A promise that resolves with the updated courier after the save operation.
   */
  abstract save(courier: Courier): Promise<void>

  /**
   * Deletes a courier by its ID.
   * 
   * @param {string} id - The ID of the courier to be deleted.
   * @returns {Promise<void>} A promise that resolves with void after the courier is deleted.
   */
  abstract delete(id: string): Promise<void>

}
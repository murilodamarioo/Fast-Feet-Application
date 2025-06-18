import { Recipient } from '@/domain/delivery/enterprise/entities/Recipient'

export abstract class RecipientsRepository {

  /**
   * Retrieves a recipient by their email.
   * 
   * @param {string} email - The email of the recipient to be retrieved.
   * @returns {Promise<Recipient | null>} A promise that resolves with the found recipient, or null if not found.
   */
  abstract findByEmail(email: string): Promise<Recipient | null>

  /**
   * Retrieves a recipient by their ID.
   * 
   * @param {string} id - The ID of the recipient to be retrieved.
   * @returns {Promise<Recipient | null>} A promise that resolves with the found recipient, or null if not found.
   */
  abstract findById(id: string): Promise<Recipient | null>

  /**
   * Creates a new recipient.
   * 
   * @param {Recipient} recipient - The recipient entity to be created.
   * @returns {Promise<void>} A promise that resolves with void after the recipient is created.
   */
  abstract create(recipient: Recipient): Promise<void>

  /**
   * Saves the recipient entity.
   * 
   * @param {Recipient} recipient - The recipient entity to be saved.
   * @returns {Promise<void>} A promise that resolves with void after the recipient is saved.
   */
  abstract save(recipient: Recipient): Promise<void>

  /**
   * Deletes a recipient by their ID.
   * 
   * @param {string} id - The ID of the recipient to be deleted.
   * @returns {Promise<void>} A promise that resolves with void after the recipient is deleted.
   */
  abstract delete(id: string): Promise<void>

}
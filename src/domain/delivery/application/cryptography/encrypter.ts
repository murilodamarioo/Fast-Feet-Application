/**
 * Abstract class representing an encryption service.
 * 
 * Implementations of this class should provide a method to encrypt a given payload.
 */
export abstract class Encrypter {
  /**
   * Encrypts the provided payload and returns the encrypted string.
   * 
   * @param payload - An object containing the data to be encrypted.
   * @returns A promise that resolves to the encrypted string.
   */
  abstract encrypt(payload: Record<string, unknown>): Promise<string>
}
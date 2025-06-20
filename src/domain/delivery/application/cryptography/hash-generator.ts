/**
 * Abstract class representing a hash generator.
 * 
 * Classes extending HashGenerator must implement the `hash` method,
 * which takes a plain string and returns a Promise that resolves to its hashed value.
 */
export abstract class HashGenerator {

  /**
   * Generates a hash from a plain string.
   * @param plain - The plain text string to be hashed.
   * @returns A Promise that resolves to the hashed string.
   */
  abstract hash(plain: string): Promise<string>

}
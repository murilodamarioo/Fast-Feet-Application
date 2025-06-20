/**
 * Abstract class representing a hash comparer.
 * 
 * Classes extending HashComparer must implement the `compare` method,
 * which checks if a plain string matches a given hash.
 */
export abstract class HashComparer {

  /**
   * Compares a plain string with a hash to check for a match.
   * @param plain - The plain text string to compare.
   * @param hash - The hashed string to compare against.
   * @returns A Promise that resolves to true if the plain string matches the hash, otherwise false.
   */
  abstract compare(plain: string, hash: string): Promise<boolean>

}
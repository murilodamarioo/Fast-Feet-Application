import { randomUUID } from 'node:crypto'

/**
 * Represents a unique identifier for an entity.
 */
export class UniqueEntityId {

  /**
   * The value of the unique identifier.
   * 
   * @private
   * @type {string}
   */
  private value: string


  /**
   * Converts the unique identifier to a string.
   * 
   * @returns {string} The string representation of the unique identifier.
   */
  toString(): string {
    return this.value
  }

  /**
   * Retrieves the raw value of the unique identifier.
   * 
   * @returns {string} The raw value of the unique identifier.
   */
  toValue(): string {
    return this.value
  }

  /**
   * Creates an instance of UniqueEntityId.
   * 
   * @param {string} [value] - An optional value for the unique identifier. If not provided, a new UUID will be generated.
   */
  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }

  /**
   * Compares this unique identifier with another to check for equality.
   * 
   * @param {UniqueEntityId} id - The unique identifier to compare with.
   * @returns {boolean} `true` if the identifiers are equal, otherwise `false`.
   */
  public equals(id: UniqueEntityId): boolean {
    return id.toValue() === this.value
  }
}
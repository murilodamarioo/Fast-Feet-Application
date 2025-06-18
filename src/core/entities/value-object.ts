/**
 * Represents a value object in the domain.
 * 
 * Value objects are objects that are defined by their properties rather than a unique identifier.
 * They are immutable and should be compared based on their property values.
 *
 * @typeParam Props - The properties type for the value object.
 */
export abstract class ValueObject<Props> {
  /**
   * The properties that define the value object.
   */
  protected props: Props

  /**
   * Creates a new value object with the given properties.
   * 
   * @param props - The properties of the value object.
   */
  protected constructor(props: Props) {
    this.props = props
  }

  /**
   * Compares this value object to another for equality.
   * 
   * @param vo - The value object to compare with.
   * @returns True if the value objects are equal, false otherwise.
   */
  public equals(vo: ValueObject<unknown>): boolean {
    if (vo === null || vo === undefined) {
      return false
    }

    if (vo.props === undefined) {
      return false
    }

    return JSON.stringify(vo.props) === JSON.stringify(this.props)
  }
}
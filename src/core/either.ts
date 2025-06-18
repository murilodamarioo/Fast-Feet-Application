// Represents an error or failure in an operation
/**
 * Class that represents an error or failure in an operation.
 * @template F Type of error value
 * @template S Type of success value (not used here)
 */
export class Failure<F, S> {
  /**
   * Error value
   */
  readonly value: F

  /**
   * Constructor for the Failure class
   * @param value Error value
   */
  constructor(value: F) {
    this.value = value
  }

  /**
   * Checks if the object is a success (always returns false)
   * @returns false
   */
  isSuccess(): this is Success<F, S> {
    return false
  }

  /**
   * Checks if the object is a failure (always returns true)
   * @returns true
   */
  isFailure(): this is Failure<F, S> {
    return true
  }
}

// Represents a success in an operation
/**
 * Class that represents a success in an operation.
 * @template F Type of error value (not used here)
 * @template S Type of success value
 */
export class Success<F, S> {
  /**
   * Success value
   */
  readonly value: S

  /**
   * Constructor for the Success class
   * @param value Success value
   */
  constructor(value: S) {
    this.value = value
  }

  /**
   * Checks if the object is a success (always returns true)
   * @returns true
   */
  isSuccess(): this is Success<F, S> {
    return true
  }

  /**
   * Checks if the object is a failure (always returns false)
   * @returns false
   */
  isFailure(): this is Failure<F, S> {
    return false
  }
}

// Type that represents a value that can be an error or a success
/**
 * Type that represents a value that can be an error or a success.
 * @template F Type of error value
 * @template S Type of success value
 */
export type Either<F, S> = Failure<F, S> | Success<F, S>

// Function that creates a Failure object
/**
 * Function that creates a Failure object.
 * @template F Type of error value
 * @template S Type of success value (not used here)
 * @param value Error value
 * @returns Either<F, S>
 */
export const failure = <F, S>(value: F): Either<F, S> => {
  return new Failure(value)
}

// Function that creates a Success object
/**
 * Function that creates a Success object.
 * @template F Type of error value (not used here)
 * @template S Type of success value
 * @param value Success value
 * @returns Either<F, S>
 */
export const success = <F, S>(value: S): Either<F, S> => {
  return new Success(value)
}
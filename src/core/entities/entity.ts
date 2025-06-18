import { UniqueEntityId } from './unique-entity-id'

/**
 * A generic base class for entities.
 * 
 * @template Props - The type of the properties that define the entity.
 */
export class Entity<Props> {
  
  /**
   * The unique identifier of the entity.
   * 
   * @private
   * @type {UniqueEntityId}
   */
  private _id: UniqueEntityId

  /**
   * The properties of the entity.
   * 
   * @protected
   * @type {Props}
   */
  protected props: Props

  /**
   * Gets the unique identifier of the entity.
   * 
   * @returns {UniqueEntityId} The unique identifier of the entity.
   */
  get id(): UniqueEntityId {
    return this._id
  }

  /**
   * Checks if the entity is equal to another entity.
   *
   * @param {Entity<Props>} entity - The entity to compare with.
   * @returns {boolean} True if the entities are equal, false otherwise.
   */
  public equals(entity: Entity<unknown>): boolean {
    if (entity === this) {
      return true
    }

    if (entity.id === this._id) {
      return true
    }

    return false
  }

  /**
   * Creates an instance of Entity.
   * 
   * @param {Props} props - The properties of the entity.
   * @param {UniqueEntityId} [id] - An optional unique identifier. If not provided, a new UUID will be generated.
   */
  protected constructor(props: Props, id?: UniqueEntityId) {
    this.props = props
    this._id = id ?? new UniqueEntityId()
  }
}
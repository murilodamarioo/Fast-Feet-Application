import { Order } from '@/domain/delivery/enterprise/entities/Order'
import { OrderDetails } from '@/domain/delivery/enterprise/entities/value-object.ts/order-details';

export abstract class OrdersRepository {

  /**
   * Retrieves an `Order` entity by its unique identifier.
   *
   * @param {string} id - The unique identifier of the order.
   * @returns {Promise<Order | null>} A promise that resolves to the `Order` entity if found, or null if not found.
   */
  abstract findById(id: string): Promise<Order | null>

  /**
   * Retrieves detailed information about an `Order` entity by its unique identifier,
   * including related data such as recipient details.
   *
   * @param {string} id - The unique identifier of the order.
   * @returns {Promise<OrderDetails | null>} A promise that resolves to the `OrderDetails` object if found, or null if not found.
   */
  abstract findOrderDetailsById(id: string): Promise<OrderDetails | null> 

  /**
   * Retrieves all orders for a specific courier filtered by status.
   *
   * @param {string} courierId - The unique identifier of the courier.
   * @param {string} status - The status to filter orders by.
   * @returns {Promise<Order[]>} A promise that resolves to an array of orders matching the criteria.
   */
  abstract findManyByStatus(courierId: string, status: string): Promise<Order[]>
  
  /**
   * Persists a new `Order` entity in the repository.
   *
   * @param {Order} order - The `Order` entity to be created.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  abstract create(order: Order): Promise<void>

  /**
   * Persists changes to an existing `Order` entity in the repository.
   *
   * @param {Order} order - The `Order` entity with updated properties to be saved.
   * @returns {Promise<void>} A promise that resolves when the update operation is complete.
   */
  abstract save(order: Order): Promise<void>

  /**
   * Updates the status of an existing `Order` entity in the repository.
   *
   * @param {Order} order - The `Order` entity with the new status to be updated.
   * @returns {Promise<void>} A promise that resolves when the status update operation is complete.
   */
  abstract updateStatus(order: Order): Promise<void>

}
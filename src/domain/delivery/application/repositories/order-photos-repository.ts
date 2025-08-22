import { OrderPhoto } from '../../enterprise/entities/Order-Photo'

export abstract class OrderPhotosRepository {
  /**
   * Creates a new `OrderPhoto` entry in the storage or database.
   *
   * @param {OrderPhoto} photo - The `OrderPhoto` entity containing the details of the photo to be created.
   * @returns {Promise<void>} A promise that resolves when the photo has been successfully created.
   */
  abstract create(photo: OrderPhoto): Promise<void>

}
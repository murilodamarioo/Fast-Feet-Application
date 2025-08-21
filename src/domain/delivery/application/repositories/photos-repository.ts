import { Photo } from '../../enterprise/entities/Photo'


export abstract class PhotosRepository {

  /**
  * Creates a new photo entity in the repository.
  * 
  * @param {Photo} photo - The Photo entity to be created.
  * @returns {Promise} A promise that resolves when the creation operation is complete. 
  */
  abstract create(photo: Photo): Promise<void>

}

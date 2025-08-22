export interface UploaderParams {
  fileName: string,
  fileType: string,
  body: Buffer
}

export abstract class Uploader {

  /**
   * Uploads a file using the provided parameters.
   *
   * @param {UploaderParams} params - The parameters required to perform the upload, including file data and metadata.
   * @returns {Promise<{ url: string }>} A promise that resolves to an object containing the URL of the uploaded file.
   */
  abstract upload(params: UploaderParams): Promise<{ url: string }>

}
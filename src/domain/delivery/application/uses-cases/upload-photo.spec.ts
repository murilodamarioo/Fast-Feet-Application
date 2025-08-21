import { InMemoryPhotosRespository } from 'test/repositories/in-memory-photos-repository'
import { UploadPhotoUseCase } from './upload-photo'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InvalidAttachementTypeError } from '@/core/errors/errors/invalid-attachement-type'

let inMemoryPhotosRespository: InMemoryPhotosRespository
let fakeUploader: FakeUploader

let sut: UploadPhotoUseCase

describe('Upload photo', () => {

  beforeEach(() => {
    inMemoryPhotosRespository = new InMemoryPhotosRespository()
    fakeUploader = new FakeUploader()

    sut = new UploadPhotoUseCase(inMemoryPhotosRespository, fakeUploader)
  })

  it('should be able to uploade a photo', async () => {
    const response = await sut.execute({
      fileName: 'photo.jpeg',
      fileType: 'image/png',
      body: Buffer.from('')
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(response.value).toEqual({
      photo: inMemoryPhotosRespository.photos[0]
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'photo.jpeg'
      })
    )
  })

  it('should not be able to upload an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'package.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isFailure()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidAttachementTypeError)
  })
})
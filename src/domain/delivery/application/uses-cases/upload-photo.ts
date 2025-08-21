import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { InvalidAttachementTypeError } from '@/core/errors/errors/invalid-attachement-type'

import { Photo } from '../../enterprise/entities/Photo'
import { PhotosRepository } from '../repositories/photos-repository'
import { Uploader } from '../storage/uploader'

interface UploadPhotoUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadPhotoUseCaseResponse = Either<InvalidAttachementTypeError, { photo: Photo }>

@Injectable()
export class UploadPhotoUseCase {

  constructor(
    private photosRepository: PhotosRepository,
    private uploader: Uploader
  ) { }

  async execute({
    fileName,
    fileType,
    body
  }: UploadPhotoUseCaseRequest): Promise<UploadPhotoUseCaseResponse> {
    const regexFileType = /^image\/(png|jpeg)$/

    if (!regexFileType.test(fileType)) {
      return failure(new InvalidAttachementTypeError(fileType))
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body
    })

    const photo = Photo.create({
      name: fileName,
      url
    })

    await this.photosRepository.create(photo)

    return success({ photo })
  }
}
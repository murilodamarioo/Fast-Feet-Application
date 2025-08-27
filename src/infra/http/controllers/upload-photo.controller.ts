import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'

import { UploadPhotoUseCase } from '@/domain/delivery/application/uses-cases/upload-photo'

import { InvalidAttachementTypeError } from '@/core/errors/errors/invalid-attachement-type'

import { RolesGuard } from '@/infra/permission/roles.guard'
import { CheckRoles } from '@/infra/permission/roles.decorator'
import { Action, AppAbility } from '@/infra/permission/ability.factory'

const parseFilePipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 2mb
    new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' })
  ]
})

@ApiBearerAuth()
@ApiTags('upload')
@Controller('/orders/:id/upload-photo')
export class UploadPhotoController {

  constructor(private uploadPhoto: UploadPhotoUseCase) { }

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(RolesGuard)
  @CheckRoles((ability: AppAbility) =>
    ability.can(Action.UPLOAD_PHOTO, 'Order')
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'string',
      format: 'binary'
    }
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'File type pdf is not supported' }
      }
    }
  })
  async handle(
    @Param('id') id: string,
    @UploadedFile(parseFilePipe) file: Express.Multer.File
  ) {
    const response = await this.uploadPhoto.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case InvalidAttachementTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { photo } = response.value

    return { photoId: photo.id.toString() }
  }
}
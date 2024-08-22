import { Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import * as toStream from 'buffer-to-stream';
import { isAllowSize, isValidFormat } from '@/utils/upload';
import { CLOUDINARY_FOLDER_NAME } from '@environments';

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File) {
    this.fileFilter(file);
    return new Promise<UploadApiResponse | UploadApiErrorResponse>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: CLOUDINARY_FOLDER_NAME,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
        toStream(file.buffer).pipe(uploadStream);
      },
    );
  }

  async deleteFile(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }

  fileFilter(file: Express.Multer.File) {
    return isValidFormat(file.mimetype) && isAllowSize(file.size);
  }
}

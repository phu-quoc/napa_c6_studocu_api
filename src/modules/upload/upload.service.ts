import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';

@Injectable()
export class UploadService {
  constructor(private cloudinaryService: CloudinaryService) {}

  async uploadFile(file: Express.Multer.File) {
    const newFile = await this.cloudinaryService.uploadFile(file);
    return {
      path: newFile.secure_url,
    };
  }
}

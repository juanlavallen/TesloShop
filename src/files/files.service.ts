import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  private readonly logger = new Logger('FilesService');

  getStaticImage(image: string) {
    const path = join(__dirname, '../../static/uploads', image);
    if (!existsSync(path)) {
      this.logger.error(`No product found with image ${image}`);
      throw new BadRequestException(`No product found with image ${image}`);
    }
    return path;
  }
}

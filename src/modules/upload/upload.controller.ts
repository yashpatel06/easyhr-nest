import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { COMMON_MESSAGE } from 'src/utils/message.enum';
import { ResponseUtilities } from 'src/utils/response.util';
import { UploadInterceptor } from 'src/utils/upload.util';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(UploadInterceptor('file', 'uploads'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.Error,
        500,
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      file,
    );
  }
}

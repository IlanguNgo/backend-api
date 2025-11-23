import {
  Post,
  Get,
  UseInterceptors,
  UploadedFiles,
  Body,
  Controller,
} from '@nestjs/common';
import { mkdir } from 'fs';
import { MailService } from 'src/common/mail/mail.service';

import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { extname } from 'path';
@Controller('shadows-unveiled')
export class ShadowsUnveiledController {
  constructor(private readonly mailService: MailService) {}
  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: (request, file, callback) => {
          const { fullName, teamName, isGroup } = request.body;
          let folderName = '';
          if (isGroup == 'true' || isGroup == true) {
            folderName = teamName;
          } else {
            folderName = fullName;
          }
          folderName = folderName.trim().replace(/\s+/g, '-');
          const uploadPath = `shadows-unveiled/${folderName}`;

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          callback(null, uploadPath);
        },
        filename: (request, file, callback) => {
          const timeStamp = Date.now();
          const random = Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const uniqueName = `${timeStamp}-${random}-${ext}`;
          callback(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 150 * 1024 * 1024,
      },
    }),
  )
  async uploadFiles(
    @Body()
    body: { fullName: string; teamName: string; isGroup: boolean | string },
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return {
      success: true,
      message: ' File Uploaded Successfully',
      folderUsed:
        body.isGroup === 'true' || body.isGroup === true
          ? body.teamName
          : body.fullName,
      totalFiles: files.length,
      files: files.map((f) => ({
        originalName: f.originalname,
        savedAs: f.filename,
        path: f.path,
        sizeInMB: (f.size / 102481024).toFixed(2),
      })),
    };
  }
  @Get()
  async sendMail() {
    console.log('Message service sending');
    this.mailService
      .sendMail(
        'jeromedharmaraj@gmail.com',
        'Testing Mail',
        'Thanks for your participation we wish you all the success',
      )
      .then((success) => console.log('mail sent successfully'))
      .catch((err) => console.log({ err }));
  }
}

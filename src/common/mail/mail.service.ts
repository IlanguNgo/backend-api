import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter<nodemailer.SentMessageInfo>;
  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('MAIL_HOST'),
      port: Number(this.config.get('MAIL_PORT')),
      secure: false,
      auth: {
        user: this.config.get('MAIL_USER'),
        pass: this.config.get('MAIL_PASSWORD'),
      },
    });
  }
  async sendMail(
    to: string,
    subject: string,
    content: string,
  ): Promise<nodemailer.SentMessageInfo> {
    return await this.transporter.sendMail({
      from: this.config.get('MAIL_USER'),
      to,
      cc: this.config.get('MAIL_CC'),
      subject,
      html: content,
    });
  }
}

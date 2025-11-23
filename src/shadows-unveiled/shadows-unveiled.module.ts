import { Module } from '@nestjs/common';
import { ShadowsUnveiledService } from './shadows-unveiled.service';
import { ShadowsUnveiledController } from './shadows-unveiled.controller';
import { MailModule } from 'src/common/mail/mail.module';
@Module({
  imports:[MailModule],
  providers: [ShadowsUnveiledService],
  controllers: [ShadowsUnveiledController]
})
export class ShadowsUnveiledModule {}

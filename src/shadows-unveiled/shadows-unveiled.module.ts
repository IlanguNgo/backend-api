// src/shadows-unveiled/shadows-unveiled.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShadowsUnveiledService } from './shadows-unveiled.service';
import { ShadowsUnveiledController } from './shadows-unveiled.controller';
import {
  ShadowsUnveiled,
  ShadowsUnveiledSchema,
} from './shadows-unveiled.schema';
import { MailModule } from '../common/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShadowsUnveiled.name, schema: ShadowsUnveiledSchema },
    ]),
    MailModule,
  ],
  providers: [ShadowsUnveiledService],
  controllers: [ShadowsUnveiledController],
  exports: [ShadowsUnveiledService],
})
export class ShadowsUnveiledModule {}

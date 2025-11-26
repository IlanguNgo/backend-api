// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VolunteerModule } from './volunteer/volunteer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogApiModule } from './blog-api/blog-api.module';
import { EventRegistrationModule } from './event-registration/event-registration.module';
import { HiddenStarsModule } from './hidden-stars/hidden-stars.module';
import { ShadowsUnveiledModule } from './shadows-unveiled/shadows-unveiled.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available everywhere
      envFilePath: '.env',
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/ilangu'),
    VolunteerModule,
    BlogApiModule,
    EventRegistrationModule,
    HiddenStarsModule,
    ShadowsUnveiledModule, // Added Shadows Unveiled Module
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

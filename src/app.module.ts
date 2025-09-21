import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VolunteerModule } from './volunteer/volunteer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogApiModule } from './blog-api/blog-api.module';
import { EventRegistrationModule } from './event-registration/event-registration.module';
import { HiddenStarsModule } from './hidden-stars/hidden-stars.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/ilangu'),
    VolunteerModule,
    BlogApiModule,
    EventRegistrationModule,
    HiddenStarsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

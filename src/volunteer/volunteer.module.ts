import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Volunteer, VolunteerSchema } from './volunteer.schema';
import { VolunteerService } from './volunteer.service';
import { VolunteerController } from './volunteer.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Volunteer.name, schema: VolunteerSchema },
    ]),
  ],
  controllers: [VolunteerController],
  providers: [VolunteerService],
})
export class VolunteerModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Registration, RegistrationSchema } from './registration.schema';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './registraion.controller';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Registration.name, schema: RegistrationSchema },
    ]),
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService],
})
export class EventRegistrationModule {}

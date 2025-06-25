import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Registration, RegistrationDocument } from './registration.schema';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectModel(Registration.name)
    private registrationModel: Model<RegistrationDocument>,
  ) {}

  async create(registrationData: any): Promise<Registration> {
    const createdVolunteer = new this.registrationModel(registrationData);
    return createdVolunteer.save();
  }

  async findAll(): Promise<Registration[]> {
    return this.registrationModel.find().exec();
  }
}

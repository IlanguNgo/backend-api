import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Volunteer, VolunteerDocument } from './volunteer.schema';

@Injectable()
export class VolunteerService {
  constructor(
    @InjectModel(Volunteer.name)
    private volunteerModel: Model<VolunteerDocument>,
  ) {}

  async create(volunteerData: any): Promise<Volunteer> {
    const createdVolunteer = new this.volunteerModel(volunteerData);
    return createdVolunteer.save();
  }

  async findAll(): Promise<Volunteer[]> {
    return this.volunteerModel.find().exec();
  }
}

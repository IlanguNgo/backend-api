import { Injectable } from '@nestjs/common';
import { HiddenStar,HiddenStarDocument } from './hidden-stars.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class HiddenStarsService {

    constructor(
        @InjectModel(HiddenStar.name)
        private registrationModel: Model<HiddenStarDocument>,
      ) {}
    
      async create(registrationData: any): Promise<HiddenStar> {
        const createdVolunteer = new this.registrationModel(registrationData);
        return createdVolunteer.save();
      }
    
      async findAll(): Promise<HiddenStar[]> {
        return this.registrationModel.find().exec();
      }
}

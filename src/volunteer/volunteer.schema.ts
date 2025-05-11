import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VolunteerDocument = Volunteer & Document;

@Schema({ timestamps: true })
export class Volunteer {
  @Prop({ required: true })
  name: string;

  @Prop()
  secondName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ default: true })
  subscribe: boolean;

  @Prop()
  comment: string;
}

export const VolunteerSchema = SchemaFactory.createForClass(Volunteer);

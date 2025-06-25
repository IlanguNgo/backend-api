import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RegistrationDocument = Registration & Document;
@Schema({ timestamps: true })
export class Registration {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  mailID: string;

  @Prop({ required: true, unique: true })
  mobileNumber: string;

  @Prop({ required: true })
  gender: string;

  @Prop()
  highestDegree: string;
  @Prop()
  collegeName: string;
}

export const RegistrationSchema = SchemaFactory.createForClass(Registration);

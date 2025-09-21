import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type HiddenStarDocument = HiddenStar & Document;
@Schema({ timestamps: true })
export class HiddenStar {
  @Prop()
  name: string;

  @Prop()
  gender: string;

  @Prop()
  schoolName: string;
  @Prop()
  topic: string;

  @Prop()
  phoneNumber: number;

  @Prop()
  email: string;

  @Prop()
  category: string;

  @Prop()
  comment: string;

  @Prop()
  ppt: string;
  
}
export const HiddenStarSchema = SchemaFactory.createForClass(HiddenStar);

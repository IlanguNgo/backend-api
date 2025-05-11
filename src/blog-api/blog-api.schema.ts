import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type BlogDocument = BlogColumns & Document;
@Schema({ timestamps: true })
export class BlogColumns {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  description: string;
  @Prop()
  firstHalf: string;
  @Prop()
  image1: string;
  @Prop()
  secondHalf: string;
  @Prop()
  image2: string;
  @Prop()
  finalWordings: string;
  @Prop()
  shortQuote: string;
}
export const BlogSchema = SchemaFactory.createForClass(BlogColumns);

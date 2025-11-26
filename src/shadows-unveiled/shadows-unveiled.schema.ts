// src/shadows-unveiled/schemas/shadows-unveiled.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShadowsUnveiledDocument = ShadowsUnveiled & Document;

class Participant {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;
}

class EventSubmission {
  @Prop({ required: true })
  eventId: string;

  @Prop({ required: true })
  eventName: string;

  @Prop({ required: true })
  eventType: string; // 'solo' or 'team'

  @Prop()
  filePath?: string;

  @Prop()
  driveLink?: string;
}

@Schema({ timestamps: true })
export class ShadowsUnveiled {
  @Prop({ required: true })
  organizationName: string;

  @Prop({ required: true })
  academicYear: string;

  @Prop({ required: true })
  course: string;

  @Prop({ required: true, default: false })
  isTeamEvent: boolean;

  @Prop()
  teamName?: string;

  @Prop()
  teamSize?: number;

  @Prop({ type: [Participant], required: true })
  participants: Participant[];

  @Prop({ type: [EventSubmission], required: true })
  selectedEvents: EventSubmission[];

  @Prop()
  queries?: string;

  @Prop({ required: true })
  paymentSlipPath: string;

  @Prop({ default: 'pending' })
  status: string; // pending, approved, rejected

  @Prop()
  registrationNumber?: string; // Auto-generated unique number
}

export const ShadowsUnveiledSchema =
  SchemaFactory.createForClass(ShadowsUnveiled);

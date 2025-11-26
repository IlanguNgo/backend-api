// src/shadows-unveiled/dto/create-shadows-unveiled.dto.ts
import {
  IsString,
  IsBoolean,
  IsNumber,
  IsArray,
  IsOptional,
  ValidateNested,
  IsEmail,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ParticipantDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phoneNumber: string;
}

export class EventSubmissionDto {
  @IsString()
  eventId: string;

  @IsString()
  eventName: string;

  @IsString()
  eventType: string;

  @IsOptional()
  @IsString()
  driveLink?: string;
}

export class CreateShadowsUnveiledDto {
  @IsString()
  organizationName: string;

  @IsString()
  academicYear: string;

  @IsString()
  course: string;

  @IsBoolean()
  isTeamEvent: boolean;

  @IsOptional()
  @IsString()
  teamName?: string;

  @IsOptional()
  @IsNumber()
  @Min(2)
  teamSize?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParticipantDto)
  participants: ParticipantDto[];

  @IsOptional()
  @IsString()
  queries?: string;
}

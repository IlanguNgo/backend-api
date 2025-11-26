// src/shadows-unveiled/shadows-unveiled.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ShadowsUnveiled,
  ShadowsUnveiledDocument,
} from './shadows-unveiled.schema';
import { MailService } from '../common/mail/mail.service';

@Injectable()
export class ShadowsUnveiledService {
  constructor(
    @InjectModel(ShadowsUnveiled.name)
    private shadowsUnveiledModel: Model<ShadowsUnveiledDocument>,
    private mailService: MailService,
  ) {}

  async create(
    registrationData: any,
    files: Express.Multer.File[],
  ): Promise<ShadowsUnveiledDocument> {
    try {
      // Parse participants if it's a string
      const participants =
        typeof registrationData.participants === 'string'
          ? JSON.parse(registrationData.participants)
          : registrationData.participants;

      // Convert isTeamEvent to boolean
      const isTeamEvent =
        registrationData.isTeamEvent === 'true' ||
        registrationData.isTeamEvent === true;

      // Build events array from form data
      const eventsCount = parseInt(registrationData.eventsCount || '0');
      // At the top of the create() method, add:
      const selectedEvents: Array<{
        eventId: string;
        eventName: string;
        eventType: string;
        filePath?: string;
        driveLink?: string;
      }> = [];

      for (let i = 0; i < eventsCount; i++) {
        const eventId = registrationData[`event_${i}_id`];
        const eventName = registrationData[`event_${i}_name`];
        const eventType = registrationData[`event_${i}_type`];
        const driveLink = registrationData[`event_${i}_driveLink`];

        // Find the uploaded file for this event
        const eventFile = files.find((f) => f.fieldname === `event_${i}_file`);

        selectedEvents.push({
          eventId,
          eventName,
          eventType,
          filePath: eventFile ? eventFile.path : undefined,
          driveLink: driveLink || undefined,
        });
      }

      // Find payment slip file
      const paymentSlipFile = files.find((f) => f.fieldname === 'paymentSlip');
      if (!paymentSlipFile) {
        throw new BadRequestException('Payment slip is required');
      }

      // Generate unique registration number
      const registrationNumber = await this.generateRegistrationNumber();

      // Create the registration document
      const registration = new this.shadowsUnveiledModel({
        organizationName: registrationData.organizationName,
        academicYear: registrationData.academicYear,
        course: registrationData.course,
        isTeamEvent,
        teamName: isTeamEvent ? registrationData.teamName : undefined,
        teamSize: isTeamEvent ? parseInt(registrationData.teamSize) : undefined,
        participants,
        selectedEvents,
        queries: registrationData.queries || '',
        paymentSlipPath: paymentSlipFile.path,
        status: 'pending',
        registrationNumber,
      });

      const savedRegistration = await registration.save();

      // Send confirmation emails to all participants
      await this.sendConfirmationEmails(savedRegistration);

      return savedRegistration;
    } catch (error) {
      throw new BadRequestException(
        `Failed to create registration: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<ShadowsUnveiledDocument[]> {
    return this.shadowsUnveiledModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<ShadowsUnveiledDocument | null> {
    return this.shadowsUnveiledModel.findById(id).exec();
  }

  async findByRegistrationNumber(
    registrationNumber: string,
  ): Promise<ShadowsUnveiledDocument | null> {
    return this.shadowsUnveiledModel.findOne({ registrationNumber }).exec();
  }

  async updateStatus(
    id: string,
    status: string,
  ): Promise<ShadowsUnveiledDocument | null> {
    const registration = await this.shadowsUnveiledModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();

    if (registration) {
      await this.sendStatusUpdateEmails(registration);
    }

    return registration;
  }

  async delete(id: string): Promise<any> {
    return this.shadowsUnveiledModel.findByIdAndDelete(id).exec();
  }

  private async generateRegistrationNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    // Count today's registrations to generate sequence number
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const count = await this.shadowsUnveiledModel
      .countDocuments({
        createdAt: { $gte: startOfDay },
      })
      .exec();

    const sequence = (count + 1).toString().padStart(4, '0');
    return `SU${year}${month}${sequence}`;
  }

  private async sendConfirmationEmails(
    registration: ShadowsUnveiledDocument,
  ): Promise<void> {
    const eventNames = registration.selectedEvents
      .map((e) => e.eventName)
      .join(', ');

    for (const participant of registration.participants) {
      const emailContent = this.generateConfirmationEmail(
        participant.name,
        registration.registrationNumber || 'PENDING',
        registration.isTeamEvent ? registration.teamName || 'Team' : 'Solo', // Add || 'Team'
        eventNames,
        registration.organizationName,
      );

      try {
        await this.mailService.sendMail(
          participant.email,
          `Shadows Unveiled - Registration Confirmation (${registration.registrationNumber})`,
          emailContent,
        );
      } catch (error) {
        console.error(`Failed to send email to ${participant.email}:`, error);
      }
    }
  }

  private async sendStatusUpdateEmails(
    registration: ShadowsUnveiledDocument,
  ): Promise<void> {
    for (const participant of registration.participants) {
      const emailContent = this.generateStatusUpdateEmail(
        participant.name,
        registration.registrationNumber || '',
        registration.status,
      );

      try {
        await this.mailService.sendMail(
          participant.email,
          `Shadows Unveiled - Registration ${registration.status.toUpperCase()} (${registration.registrationNumber})`,
          emailContent,
        );
      } catch (error) {
        console.error(
          `Failed to send status email to ${participant.email}:`,
          error,
        );
      }
    }
  }

  private generateConfirmationEmail(
    name: string,
    registrationNumber: string,
    teamInfo: string,
    events: string,
    organization: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea; border-radius: 5px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          .highlight { color: #667eea; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎭 Shadows Unveiled</h1>
            <p>Registration Confirmation</p>
          </div>
          <div class="content">
            <h2>Dear ${name},</h2>
            <p>Thank you for registering for Shadows Unveiled! We're excited to have you participate in this amazing event.</p>
            
            <div class="info-box">
              <h3>Registration Details:</h3>
              <p><strong>Registration Number:</strong> <span class="highlight">${registrationNumber}</span></p>
              <p><strong>Organization:</strong> ${organization}</p>
              <p><strong>Team/Type:</strong> ${teamInfo}</p>
              <p><strong>Events Registered:</strong> ${events}</p>
              <p><strong>Status:</strong> <span style="color: #ffa500;">Submitted</span></p>
            </div>
            
            <p>Your registration to the grand event "SHADOWS UNVEILED" is been registered successful. Congratulations in advance and awaiting your presence on the day of the event.</p>
            
            <p><strong>Important:</strong> Please save your registration number for future reference.</p>
            
            <p>If you have any queries or doubts, feel free to call us at +91 6380559492.</p>
            
            <p>Best regards,<br><strong>Ilangu Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply directly to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateStatusUpdateEmail(
    name: string,
    registrationNumber: string,
    status: string,
  ): string {
    const statusColor = status === 'approved' ? '#28a745' : '#dc3545';
    const statusMessage =
      status === 'approved'
        ? 'Congratulations! Your registration has been approved.'
        : 'We regret to inform you that your registration has been rejected.';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .status-box { background: white; padding: 20px; margin: 20px 0; text-align: center; border-radius: 5px; border: 2px solid ${statusColor}; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎭 Shadows Unveiled</h1>
            <p>Registration Status Update</p>
          </div>
          <div class="content">
            <h2>Dear ${name},</h2>
            
            <div class="status-box">
              <h3 style="color: ${statusColor}; margin: 0;">Registration ${status.toUpperCase()}</h3>
              <p style="margin: 10px 0 0 0;">Registration Number: <strong>${registrationNumber}</strong></p>
            </div>
            
            <p>${statusMessage}</p>
            
            ${
              status === 'approved'
                ? '<p>We look forward to seeing your amazing performance! Further details about the event will be shared soon.</p>'
                : '<p>If you have any questions or concerns, please feel free to contact us.</p>'
            }
            
            <p>Best regards,<br><strong>Shadows Unveiled Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply directly to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

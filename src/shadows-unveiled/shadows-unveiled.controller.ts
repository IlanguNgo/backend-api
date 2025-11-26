// src/shadows-unveiled/shadows-unveiled.controller.ts
import {
  Post,
  Get,
  Put,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Body,
  Controller,
  Param,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { extname } from 'path';
import { ShadowsUnveiledService } from './shadows-unveiled.service';

@Controller('shadows-unveiled')
export class ShadowsUnveiledController {
  constructor(
    private readonly shadowsUnveiledService: ShadowsUnveiledService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: (request, file, callback) => {
          const { organizationName, teamName, isTeamEvent } = request.body;

          let folderName = '';
          if (isTeamEvent === 'true' || isTeamEvent === true) {
            folderName = teamName || 'team';
          } else {
            // For solo events, get the first participant's name
            let participants;
            try {
              participants = JSON.parse(request.body.participants || '[]');
            } catch {
              participants = [];
            }
            folderName = participants[0]?.name || 'solo-participant';
          }

          // Sanitize folder name
          folderName = folderName
            .trim()
            .replace(/[^a-zA-Z0-9-_]/g, '-')
            .replace(/\s+/g, '-')
            .toLowerCase();

          const timestamp = Date.now();
          const uploadPath = `uploads/shadows-unveiled/${folderName}-${timestamp}`;

          // Create directory if it doesn't exist
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          callback(null, uploadPath);
        },
        filename: (request, file, callback) => {
          const timestamp = Date.now();
          const random = Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const sanitizedFieldname = file.fieldname.replace(
            /[^a-zA-Z0-9]/g,
            '_',
          );
          const uniqueName = `${sanitizedFieldname}-${timestamp}-${random}${ext}`;
          callback(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 150 * 1024 * 1024, // 150MB
      },
      fileFilter: (request, file, callback) => {
        // Accept images, videos, and PDFs
        const allowedMimes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'video/mp4',
          'video/mpeg',
          'video/quicktime',
          'video/x-msvideo',
          'application/pdf',
        ];

        if (allowedMimes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              `Unsupported file type: ${file.mimetype}. Only images, videos, and PDFs are allowed.`,
            ),
            false,
          );
        }
      },
    }),
  )
  async create(
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      // Validate that we have files
      if (!files || files.length === 0) {
        throw new BadRequestException('No files uploaded');
      }

      // Validate payment slip
      const paymentSlip = files.find((f) => f.fieldname === 'paymentSlip');
      if (!paymentSlip) {
        throw new BadRequestException('Payment slip is required');
      }

      // Create registration
      const registration = await this.shadowsUnveiledService.create(
        body,
        files,
      );

      return {
        success: true,
        message: 'Registration submitted successfully',
        data: {
          registrationNumber: registration.registrationNumber,
          id: registration._id,
          status: registration.status,
          isTeamEvent: registration.isTeamEvent,
          teamName: registration.teamName,
          participants: registration.participants,
          events: registration.selectedEvents.map((e) => ({
            eventName: e.eventName,
            eventType: e.eventType,
          })),
        },
      };
    } catch (error) {
      // Clean up uploaded files if registration fails
      if (files && files.length > 0) {
        files.forEach((file) => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }

      throw new BadRequestException(
        error.message || 'Failed to create registration',
      );
    }
  }

  @Get()
  async findAll() {
    const registrations = await this.shadowsUnveiledService.findAll();
    return {
      success: true,
      count: registrations.length,
      data: registrations,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const registration = await this.shadowsUnveiledService.findOne(id);

    if (!registration) {
      throw new BadRequestException('Registration not found');
    }

    return {
      success: true,
      data: registration,
    };
  }

  @Get('registration-number/:registrationNumber')
  async findByRegistrationNumber(
    @Param('registrationNumber') registrationNumber: string,
  ) {
    const registration =
      await this.shadowsUnveiledService.findByRegistrationNumber(
        registrationNumber,
      );

    if (!registration) {
      throw new BadRequestException('Registration not found');
    }

    return {
      success: true,
      data: registration,
    };
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    const validStatuses = ['pending', 'approved', 'rejected'];

    if (!validStatuses.includes(body.status)) {
      throw new BadRequestException(
        `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      );
    }

    const registration = await this.shadowsUnveiledService.updateStatus(
      id,
      body.status,
    );

    if (!registration) {
      throw new BadRequestException('Registration not found');
    }

    return {
      success: true,
      message: `Registration status updated to ${body.status}`,
      data: registration,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const registration = await this.shadowsUnveiledService.delete(id);

    if (!registration) {
      throw new BadRequestException('Registration not found');
    }

    return {
      success: true,
      message: 'Registration deleted successfully',
      data: registration,
    };
  }

  @Get('stats/summary')
  async getStats() {
    const registrations = await this.shadowsUnveiledService.findAll();

    const stats = {
      total: registrations.length,
      pending: registrations.filter((r) => r.status === 'pending').length,
      approved: registrations.filter((r) => r.status === 'approved').length,
      rejected: registrations.filter((r) => r.status === 'rejected').length,
      teamEvents: registrations.filter((r) => r.isTeamEvent).length,
      soloEvents: registrations.filter((r) => !r.isTeamEvent).length,
      totalParticipants: registrations.reduce(
        (sum, r) => sum + r.participants.length,
        0,
      ),
    };

    return {
      success: true,
      data: stats,
    };
  }
}

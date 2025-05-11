import { Controller, Get, Post, Body } from '@nestjs/common';
import { VolunteerService } from './volunteer.service';

@Controller('volunteers')
export class VolunteerController {
  constructor(private readonly volunteerService: VolunteerService) {}

  @Post()
  create(@Body() body: any) {
    return this.volunteerService.create(body);
  }

  @Get()
  findAll() {
    return this.volunteerService.findAll();
  }
}

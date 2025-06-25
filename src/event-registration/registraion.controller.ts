import { Controller, Get, Post, Body } from '@nestjs/common';
import { RegistrationService } from './registration.service';

@Controller('register')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  create(@Body() body: any) {
    return this.registrationService.create(body);
  }

  @Get()
  findAll() {
    return this.registrationService.findAll();
  }
}

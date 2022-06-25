import { Controller, Get } from '@nestjs/common';
import { VisitsService } from '../services/visits.service';

@Controller()
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Get()
  public getVisits() {
    return this.visitsService.getVisits();
  }
}

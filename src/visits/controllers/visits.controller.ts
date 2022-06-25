import { Controller, Get, HttpStatus, Inject } from '@nestjs/common';
import { VisitsService, VisitsServiceInterface } from '../services/visits.service';
import { VisitsCounterDto } from '../dto/visits-counter.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('visits')
@Controller('visits')
export class VisitsController {
  constructor(
    @Inject(VisitsService)
    private readonly visitsService: VisitsServiceInterface,
  ) {}

  @ApiOperation({ summary: 'Get visits counter for each visitor' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: VisitsCounterDto,
    isArray: true,
  })
  @Get('counter')
  public getVisitsCounter(): Promise<VisitsCounterDto[]> {
    return this.visitsService.getVisitsCounter();
  }
}

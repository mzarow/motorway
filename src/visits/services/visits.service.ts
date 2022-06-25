import { Inject, Injectable } from '@nestjs/common';
import { MotorwayWebService, MotorwayWebServiceInterface } from '../../shared/motorway-web/motorway-web.service';
import { plainToInstance } from 'class-transformer';
import { VisitsCounterDto } from '../dto/visits-counter.dto';
import { isToday, isWeekendDay } from '../../shared/utils/date.utils';

export interface VisitsServiceInterface {
  getVisitsCounter(): Promise<VisitsCounterDto[]>;
}

@Injectable()
export class VisitsService implements VisitsServiceInterface {
  constructor(
    @Inject(MotorwayWebService)
    private readonly motorwayWebService: MotorwayWebServiceInterface,
  ) {}

  public async getVisitsCounter(): Promise<VisitsCounterDto[]> {
    const allVisits = await this.motorwayWebService.getVisits();
    const peopleVisitsCountMap: Record<string, number> = allVisits.reduce((map, visit) => {
      if (isToday(visit.date) || isWeekendDay(visit.date)) {
        return map;
      }

      if (map[visit.name] === undefined) {
        map[visit.name] = 1;
      } else {
        map[visit.name]++;
      }

      return map;
    }, {});

    return Object.entries(peopleVisitsCountMap).map(([name, visitsCount]) =>
      plainToInstance(VisitsCounterDto, {
        name,
        visitsCount,
      }),
    );
  }
}

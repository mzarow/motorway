import { Test, TestingModule } from '@nestjs/testing';
import { VisitsService, VisitsServiceInterface } from './visits.service';
import { createMock, DeepMocked } from '@golevelup/nestjs-testing';
import { VisitsCounterDto } from '../dto/visits-counter.dto';
import { MotorwayWebService, MotorwayWebServiceInterface } from '../../shared/motorway-web/motorway-web.service';
import { VisitWebDto } from '../../shared/motorway-web/dto/visit-web.dto';

describe('VisitsService', () => {
  let visitsService: VisitsServiceInterface;
  let motorwayWebServiceMock: DeepMocked<MotorwayWebServiceInterface>;

  beforeEach(async () => {
    motorwayWebServiceMock = createMock<MotorwayWebServiceInterface>();

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        VisitsService,
        {
          provide: MotorwayWebService,
          useValue: motorwayWebServiceMock,
        },
      ],
    }).compile();

    visitsService = app.get<VisitsServiceInterface>(VisitsService);
  });

  describe('getVisitsCounter', () => {
    it('should return visits counter', async () => {
      // Arrange
      const visitAtWeek1 = new VisitWebDto();
      visitAtWeek1.name = 'Visitor #1';
      visitAtWeek1.date = '2022-02-15T08:40:57+00:00';

      const visitAtWeek2 = new VisitWebDto();
      visitAtWeek2.name = 'Visitor #1';
      visitAtWeek2.date = '2022-02-17T10:33:17+00:00';

      const visitAtWeek3 = new VisitWebDto();
      visitAtWeek3.name = 'Visitor #3';
      visitAtWeek3.date = '2022-02-08T06:42:01+00:00';

      const visits = [visitAtWeek1, visitAtWeek2, visitAtWeek3];

      motorwayWebServiceMock.getVisits.mockResolvedValue(visits);

      // Act
      const result = await visitsService.getVisitsCounter();

      // Assert
      expect(result).toMatchObject([
        {
          name: 'Visitor #1',
          visitsCount: 2,
        },
        {
          name: 'Visitor #3',
          visitsCount: 1,
        },
      ]);
      result.forEach((each) => expect(each).toBeInstanceOf(VisitsCounterDto));
    });

    it('should omit counting visits for weekend days', async () => {
      // Arrange
      const visitAtWeek = new VisitWebDto();
      visitAtWeek.name = 'Visitor #1';
      visitAtWeek.date = '2022-02-15T08:40:57+00:00';

      const visitAtWeekend = new VisitWebDto();
      visitAtWeekend.name = 'Visitor #1';
      visitAtWeekend.date = '2022-02-19T18:41:32+00:00';

      const visits = [visitAtWeek, visitAtWeekend];

      motorwayWebServiceMock.getVisits.mockResolvedValue(visits);

      // Act
      const result = await visitsService.getVisitsCounter();

      // Assert
      expect(result).toMatchObject([
        {
          name: 'Visitor #1',
          visitsCount: 1,
        },
      ]);
    });

    it('should omit counting visits for today', async () => {
      // Arrange
      const visitAtWeek = new VisitWebDto();
      visitAtWeek.name = 'Visitor #1';
      visitAtWeek.date = '2022-02-15T08:40:57+00:00';

      const visitToday = new VisitWebDto();
      visitToday.name = 'Visitor #1';
      visitToday.date = new Date().toISOString();

      const visits = [visitAtWeek, visitToday];

      motorwayWebServiceMock.getVisits.mockResolvedValue(visits);

      // Act
      const result = await visitsService.getVisitsCounter();

      // Assert
      expect(result).toMatchObject([
        {
          name: 'Visitor #1',
          visitsCount: 1,
        },
      ]);
    });
  });
});

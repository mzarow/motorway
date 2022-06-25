import { Test, TestingModule } from '@nestjs/testing';
import { VisitsController } from './visits.controller';
import { VisitsService, VisitsServiceInterface } from '../services/visits.service';
import { createMock, DeepMocked } from '@golevelup/nestjs-testing';
import { VisitsCounterDto } from '../dto/visits-counter.dto';

describe('VisitsController', () => {
  let visitsController: VisitsController;
  let visitsServiceMock: DeepMocked<VisitsServiceInterface>;

  beforeEach(async () => {
    visitsServiceMock = createMock<VisitsServiceInterface>();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [VisitsController],
      providers: [
        {
          provide: VisitsService,
          useValue: visitsServiceMock,
        },
      ],
    }).compile();

    visitsController = app.get<VisitsController>(VisitsController);
  });

  describe('getVisitsCounter', () => {
    it('should return visits counter', async () => {
      // Arrange
      const visitCounter1 = new VisitsCounterDto();
      visitCounter1.name = 'Visitor #1';
      visitCounter1.visitsCount = 10;

      const visitCounter2 = new VisitsCounterDto();
      visitCounter2.name = 'Visitor #2';
      visitCounter2.visitsCount = 2;

      const visits = [visitCounter1, visitCounter2];

      visitsServiceMock.getVisitsCounter.mockResolvedValue(visits);

      // Act
      const result = await visitsController.getVisitsCounter();

      // Assert
      expect(result).toMatchObject(visits);
    });
  });
});

import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { VisitsController } from './controllers/visits.controller';
import { VisitsService } from './services/visits.service';

@Module({
  imports: [SharedModule],
  controllers: [VisitsController],
  providers: [VisitsService],
})
export class VisitsModule {}

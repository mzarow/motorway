import { Module } from '@nestjs/common';
import { MotorwayWebService } from './motorway-web.service';
import { HttpModule } from '../http/http.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [MotorwayWebService],
  exports: [MotorwayWebService],
})
export class MotorwayWebModule {}

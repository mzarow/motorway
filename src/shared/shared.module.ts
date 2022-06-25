import { Module } from '@nestjs/common';
import { HttpModule } from './http/http.module';
import { MotorwayWebModule } from './motorway-web/motorway-web.module';

const SHARED_MODULES = [HttpModule, MotorwayWebModule];

@Module({
  imports: [...SHARED_MODULES],
  exports: [...SHARED_MODULES],
})
export class SharedModule {}

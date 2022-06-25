import { Module } from '@nestjs/common';
import { VisitsModule } from './visits/visits.module';
import { ConfigModule } from '@nestjs/config';
import { MotorwayWebModule } from './shared/motorway-web/motorway-web.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    VisitsModule,
    MotorwayWebModule,
  ],
})
export class AppModule {}

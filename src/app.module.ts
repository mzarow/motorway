import { Module } from '@nestjs/common';
import { VisitsModule } from './visits/visits.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), VisitsModule],
})
export class AppModule {}

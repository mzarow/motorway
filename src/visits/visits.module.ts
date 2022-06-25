import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, SharedModule],
})
export class VisitsModule {}

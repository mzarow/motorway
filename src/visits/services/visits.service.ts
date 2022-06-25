import { Injectable } from '@nestjs/common';

@Injectable()
export class VisitsService {
  public getVisits(): string {
    return 'Hello World!';
  }
}

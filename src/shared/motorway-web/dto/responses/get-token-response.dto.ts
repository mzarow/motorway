import { VisitWebDto } from './visit-web.dto';

export class GetVisitsResponseDto {
  public data: VisitWebDto[];
  public total: number;
}

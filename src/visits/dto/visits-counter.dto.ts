import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class VisitsCounterDto {
  @Expose()
  public name: string;

  @Expose()
  public visitsCount: number;
}

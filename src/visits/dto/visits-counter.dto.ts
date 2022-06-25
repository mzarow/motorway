import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class VisitsCounterDto {
  @ApiProperty()
  @Expose()
  public name: string;

  @ApiProperty()
  @Expose()
  public visitsCount: number;
}

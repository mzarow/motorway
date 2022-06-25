import { HttpService as AxiosHttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpService {
  constructor(private readonly httpService: AxiosHttpService) {}

  public async get<T>(
    url: string,
    config?: Record<string, unknown>,
  ): Promise<T> {
    const response = await firstValueFrom(this.httpService.get<T>(url, config));

    return response.data;
  }
}

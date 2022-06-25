import { Injectable } from '@nestjs/common';
import { HttpService } from '../http/http.service';
import { ConfigService } from '@nestjs/config';
import { Method } from 'axios';
import { isServerErrorCode } from '../utils/http-status-codes.utils';

export interface MotorwayWebServiceInterface {
  getVisits(): Promise<any>;
}

@Injectable()
export class MotorwayWebService implements MotorwayWebServiceInterface {
  private readonly retryCount = 3;

  constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {}

  public async getVisits(): Promise<any> {
    const pageNo = 1;
    const token = await this.getToken();
    const url = `${this.getBaseUrl()}/visits?page=${pageNo}&token=${token}`;
  }

  private getToken(): Promise<string> {
    const url = `${this.getBaseUrl()}/login`;

    return this.request('GET', url);
  }

  private async request<T>(method: Method, url: string): Promise<T> {
    let requestPromise: Promise<T>;

    switch (method) {
      case 'GET':
        requestPromise = this.httpService.get<T>(url);
        break;
      default:
        throw new Error(`Unsupported HTTP method - ${method}`);
    }

    let data: T;
    let retriesAvailable = this.retryCount;

    try {
      data = await requestPromise;
    } catch (err) {
      const isServerFault = isServerErrorCode(err.response?.status) || err.code === 'ECONNREFUSED';

      if (isServerFault && retriesAvailable) {
        retriesAvailable--;

        return this.request(method, url);
      }

      console.error(err);
      throw new Error('Unable to fetch data from API');
    }

    return data;
  }

  private getBaseUrl(): string {
    return this.configService.get<string>('MOTORWAY_BACKEND_API');
  }
}

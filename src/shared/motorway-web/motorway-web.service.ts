import { Injectable } from '@nestjs/common';
import { HttpService } from '../http/http.service';
import { ConfigService } from '@nestjs/config';
import { Method } from 'axios';
import { isServerErrorCode } from '../utils/http-status-codes.utils';
import { GetVisitsResponseDto } from './dto/responses/get-visits-response.dto';
import { VisitWebDto } from './dto/visit-web.dto';
import { GetTokenResponseDto } from './dto/responses/get-token-response.dto';

export interface MotorwayWebServiceInterface {
  getVisits(): Promise<VisitWebDto[]>;
}

@Injectable()
export class MotorwayWebService implements MotorwayWebServiceInterface {
  private readonly retryCount = 3;

  constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {}

  public async getVisits(): Promise<VisitWebDto[]> {
    const pageNo = 1;
    const token = await this.getToken();
    const url = `${this.getBaseUrl()}/visits?page=${pageNo}&token=${token}`;

    const response = await this.request<GetVisitsResponseDto>('GET', url);
    const data = response.data;

    const totalSize = response.total;
    const pageSize = response.data.length;

    if (totalSize > pageSize) {
      const pagesCount = Math.ceil(totalSize / pageSize);
      const nextPageNo = pageNo + 1;
      const remainingRequests: Promise<GetVisitsResponseDto>[] = [];

      for (let i = nextPageNo; i <= pagesCount; i++) {
        const url = `${this.getBaseUrl()}/visits?page=${i}&token=${token}`;

        remainingRequests.push(this.request<GetVisitsResponseDto>('GET', url));
      }

      const restResponses = await Promise.all(remainingRequests);
      const restData = restResponses.map((res) => res.data).flat();

      return [...data, ...restData];
    }

    return data;
  }

  private async getToken(): Promise<string> {
    const url = `${this.getBaseUrl()}/login`;
    const data = await this.request<GetTokenResponseDto>('GET', url);

    return data.token;
  }

  // If retry policy applicable to all web services, could be extracted and put into abstract web service and inherited later
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

    for (let i = 1; i < this.retryCount; i++) {
      try {
        data = await requestPromise;
      } catch (err) {
        const isServerFault = isServerErrorCode(err.response?.status) || err.code === 'ECONNREFUSED';
        const retriesAvailable = i < this.retryCount;

        if (isServerFault && retriesAvailable) {
          continue;
        }

        console.error(err.response);
        throw new Error('Unable to fetch data from API');
      }
    }

    return data;
  }

  private getBaseUrl(): string {
    return this.configService.get<string>('MOTORWAY_BACKEND_API');
  }
}

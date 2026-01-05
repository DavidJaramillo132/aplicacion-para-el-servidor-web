import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  private readonly msMasterUrl = process.env.MS_MASTER_URL || 'http://ms-master:3001';
  private readonly msWorkerUrl = process.env.MS_WORKER_URL || 'http://ms-worker:3002';

  constructor(private readonly httpService: HttpService) {}

  /**
   * Reenvía la solicitud hacia ms-master (cuentas)
   */
  async proxyToMaster(method: string, path: string, body?: any): Promise<any> {
    try {
      const url = `${this.msMasterUrl}${path}`;
      this.logger.log(`[PROXY] ${method} ${url}`);

      let request: any;
      if (method === 'GET') {
        request = this.httpService.get(url);
      } else if (method === 'POST') {
        request = this.httpService.post(url, body);
      } else if (method === 'PUT') {
        request = this.httpService.put(url, body);
      } else if (method === 'DELETE') {
        request = this.httpService.delete(url);
      }

      const response = await firstValueFrom(request as any);
      return (response as any).data;
    } catch (error: any) {
      this.logger.error(`[PROXY_ERROR] Failed to reach ms-master: ${error.message}`);
      throw new HttpException(
        {
          message: 'Error reaching master service',
          error: error.message,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  /**
   * Reenvía la solicitud hacia ms-worker (transferencias)
   */
  async proxyToWorker(method: string, path: string, body?: any): Promise<any> {
    try {
      const url = `${this.msWorkerUrl}${path}`;
      this.logger.log(`[PROXY] ${method} ${url}`);

      let request: any;
      if (method === 'GET') {
        request = this.httpService.get(url);
      } else if (method === 'POST') {
        request = this.httpService.post(url, body);
      } else if (method === 'PUT') {
        request = this.httpService.put(url, body);
      } else if (method === 'DELETE') {
        request = this.httpService.delete(url);
      }

      const response = await firstValueFrom(request as any);
      return (response as any).data;
    } catch (error: any) {
      this.logger.error(`[PROXY_ERROR] Failed to reach ms-worker: ${error.message}`);
      throw new HttpException(
        {
          message: 'Error reaching worker service',
          error: error.message,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}

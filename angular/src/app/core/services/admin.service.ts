import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '../config/constants';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly api = inject(ApiClientService);

  confirmPayment<T>(paymentId: number): Observable<T> {
    return this.api.post<T>(ENDPOINTS.CONFIRM_PAYMENT, { paymentId });
  }
}

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '../config/constants';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private readonly api = inject(ApiClientService);

  getDashboard<T>(): Observable<T> {
    return this.api.get<T>(ENDPOINTS.RESTAURANT_DASHBOARD);
  }

  getProfile<T>(): Observable<T> {
    return this.api.get<T>(ENDPOINTS.RESTAURANT_PROFILE);
  }

  updateProfile<T>(payload: unknown): Observable<T> {
    return this.api.put<T>(ENDPOINTS.RESTAURANT_UPDATE_INFO, payload);
  }

  getOrders<T>(params?: Record<string, string | number | boolean>): Observable<T> {
    return this.api.get<T>(ENDPOINTS.RESTAURANT_ORDERS, params);
  }

  addDish<T>(payload: unknown): Observable<T> {
    return this.api.post<T>(ENDPOINTS.ADD_DISH, payload);
  }

  updateDish<T>(payload: unknown): Observable<T> {
    return this.api.put<T>(ENDPOINTS.UPDATE_DISH, payload);
  }

  deleteDish<T>(dishId: number): Observable<T> {
    return this.api.delete<T>(ENDPOINTS.DELETE_DISH, { dishId });
  }

  toggleDishAvailability<T>(dishId: number, is_available: boolean): Observable<T> {
    return this.api.put<T>(ENDPOINTS.TOGGLE_DISH_AVAILABILITY, { dishId, is_available });
  }

  updateOrderStatus<T>(orderId: number, status: string): Observable<T> {
    return this.api.post<T>(ENDPOINTS.UPDATE_ORDER_STATUS, { orderId, status });
  }
}

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '../config/constants';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly api = inject(ApiClientService);

  getProfile<T>(): Observable<T> {
    return this.api.get<T>(ENDPOINTS.CUSTOMER_PROFILE);
  }

  updateProfile<T>(payload: { name?: string; phone?: string }): Observable<T> {
    return this.api.put<T>(ENDPOINTS.CUSTOMER_UPDATE_PROFILE, payload);
  }

  getAllRestaurants<T>(): Observable<T> {
    return this.api.get<T>(ENDPOINTS.ALL_RESTAURANTS);
  }

  getNearbyRestaurants<T>(lat: number, lng: number): Observable<T> {
    return this.api.post<T>(ENDPOINTS.NEAREST_RESTAURANTS, { lat, lng });
  }

  viewCart<T>(): Observable<T> {
    return this.api.get<T>(ENDPOINTS.VIEW_CART);
  }

  addToCart<T>(dishId: number, quantity: number): Observable<T> {
    return this.api.post<T>(ENDPOINTS.ADD_TO_CART, { dishId, quantity });
  }

  updateCartQuantity<T>(dishId: number, quantity: number): Observable<T> {
    return this.api.put<T>('/customer/update-dish-quantity-in-cart', { dishId, quantity });
  }

  removeFromCart<T>(dishId: number): Observable<T> {
    return this.api.delete<T>(ENDPOINTS.REMOVE_FROM_CART, { dishId });
  }

  placeOrder<T>(payload: unknown): Observable<T> {
    return this.api.post<T>(ENDPOINTS.PLACE_ORDER, payload);
  }
}

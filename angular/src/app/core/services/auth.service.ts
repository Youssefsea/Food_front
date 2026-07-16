import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ENDPOINTS } from '../config/constants';
import { ApiClientService } from './api-client.service';
import { AppStateService } from './app-state.service';

interface LoginResponse {
  user?: { token?: string; name?: string; role?: 'customer' | 'vendor' | 'admin' };
  restaurant?: { token?: string; name?: string; role?: 'vendor' };
  admin?: { token?: string; name?: string; role?: 'admin' };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiClientService);
  private readonly state = inject(AppStateService);

  customerLogin(credentials: { email: string; password: string }): Observable<void> {
    return this.api.post<LoginResponse>(ENDPOINTS.CUSTOMER_LOGIN, credentials).pipe(
      map((res) => this.persistAuth(res.user?.token, 'customer', res.user?.name ?? 'عميل'))
    );
  }

  vendorLogin(credentials: { email: string; password: string }): Observable<void> {
    return this.api.post<LoginResponse>(ENDPOINTS.RESTAURANT_LOGIN, credentials).pipe(
      map((res) => {
        const subject = res.restaurant ?? res.user;
        this.persistAuth(subject?.token, 'vendor', subject?.name ?? 'مطعم');
      })
    );
  }

  adminLogin(credentials: { email: string; password: string }): Observable<void> {
    return this.api.post<LoginResponse>('/LogforAdmin', credentials).pipe(
      map((res) => {
        const subject = res.admin ?? res.user;
        this.persistAuth(subject?.token, 'admin', subject?.name ?? 'مدير');
      })
    );
  }

  logout(): void {
    this.api.clearToken();
    this.state.logout();
  }

  private persistAuth(token: string | undefined, role: 'customer' | 'vendor' | 'admin', name: string): void {
    if (!token) {
      return;
    }
    this.api.setToken(token);
    this.state.setUser(role, name);
  }
}

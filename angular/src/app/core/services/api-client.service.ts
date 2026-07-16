import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://food-blond-three.vercel.app';

  private get headers(): HttpHeaders {
    const token = localStorage.getItem('akly-token');
    return token ? new HttpHeaders({ Authorization: token }) : new HttpHeaders();
  }

  get<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`, { headers: this.headers, params: params as never });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body, { headers: this.headers });
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body, { headers: this.headers });
  }

  delete<T>(path: string, body?: unknown): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`, { headers: this.headers, body });
  }

  setToken(token: string): void {
    localStorage.setItem('akly-token', token);
  }

  clearToken(): void {
    localStorage.removeItem('akly-token');
  }
}

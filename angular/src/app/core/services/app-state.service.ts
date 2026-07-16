import { Injectable, computed, effect, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppStateService {
  readonly userRole = signal<'customer' | 'vendor' | 'admin' | null>(null);
  readonly userName = signal<string>('');
  readonly isAuthenticated = computed(() => this.userRole() !== null);

  constructor() {
    effect(() => {
      const role = this.userRole();
      if (role) {
        localStorage.setItem('akly-role', role);
      } else {
        localStorage.removeItem('akly-role');
      }
    });

    const savedRole = localStorage.getItem('akly-role') as 'customer' | 'vendor' | 'admin' | null;
    if (savedRole) {
      this.userRole.set(savedRole);
    }
  }

  setUser(role: 'customer' | 'vendor' | 'admin', userName: string): void {
    this.userRole.set(role);
    this.userName.set(userName);
  }

  logout(): void {
    this.userRole.set(null);
    this.userName.set('');
  }
}

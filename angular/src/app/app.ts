import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AppStateService } from './core/services/app-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen bg-background text-dark">
      <header class="sticky top-0 z-20 border-b border-orange-100 bg-white/90 backdrop-blur">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
          <a routerLink="/" class="text-xl font-black text-primary">أكلي</a>
          <div class="text-sm text-muted">
            @if (state.isAuthenticated()) {
              <span>مرحباً {{ state.userName() || 'مستخدم' }}</span>
            } @else {
              <span>تجربة Angular Standalone</span>
            }
          </div>
        </div>
      </header>

      <router-outlet />
    </div>
  `
})
export class App {
  protected readonly state = inject(AppStateService);
}

import { Component, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from '../../core/models/common.models';

@Component({
  selector: 'app-vendor-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <button
      type="button"
      (click)="isOpen.set(!isOpen())"
      class="fixed right-4 top-4 z-40 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white md:hidden"
    >
      القائمة
    </button>

    <aside
      class="fixed inset-y-0 right-0 z-30 w-72 border-l border-orange-100 bg-white p-6 shadow-xl transition md:static md:translate-x-0"
      [class.translate-x-full]="!isOpen()"
    >
      <h2 class="mb-6 text-xl font-extrabold text-dark">لوحة المطعم</h2>
      <ul class="space-y-2">
        @for (item of items(); track item.href) {
          <li>
            <a
              [routerLink]="item.href"
              routerLinkActive="bg-primary text-white"
              class="block rounded-xl px-4 py-3 text-sm font-semibold text-muted transition hover:bg-orange-50"
              (click)="isOpen.set(false)"
            >
              {{ item.label }}
            </a>
          </li>
        }
      </ul>
    </aside>
  `
})
export class VendorSidebarComponent {
  readonly items = input.required<readonly NavItem[]>();
  readonly isOpen = signal(false);
}

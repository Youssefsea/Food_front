import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from '../../core/models/common.models';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur md:hidden">
      <ul class="mx-auto grid max-w-3xl grid-cols-5 gap-1 px-2 py-2">
        @for (item of items(); track item.href) {
          <li>
            <a
              [routerLink]="item.href"
              routerLinkActive="text-primary"
              class="block rounded-lg px-2 py-2 text-center text-xs font-medium text-muted transition hover:bg-orange-50"
            >
              {{ item.label }}
            </a>
          </li>
        }
      </ul>
    </nav>
  `
})
export class BottomNavComponent {
  readonly items = input.required<readonly NavItem[]>();
}

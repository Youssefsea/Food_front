import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNavComponent } from '../../shared/navigation/bottom-nav.component';
import { CUSTOMER_NAV_ITEMS } from '../../core/config/constants';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [RouterOutlet, BottomNavComponent],
  template: `
    <div class="min-h-screen pb-20">
      <router-outlet />
      <app-bottom-nav [items]="navItems" />
    </div>
  `
})
export class CustomerLayoutComponent {
  protected readonly navItems = CUSTOMER_NAV_ITEMS;
}

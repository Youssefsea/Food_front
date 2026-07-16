import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VendorSidebarComponent } from '../../shared/navigation/vendor-sidebar.component';
import { VENDOR_NAV_ITEMS } from '../../core/config/constants';

@Component({
  selector: 'app-vendor-layout',
  standalone: true,
  imports: [RouterOutlet, VendorSidebarComponent],
  template: `
    <div class="min-h-screen bg-orange-50/40 md:grid md:grid-cols-[18rem_1fr]">
      <app-vendor-sidebar [items]="navItems" />
      <main class="p-4 md:p-8">
        <router-outlet />
      </main>
    </div>
  `
})
export class VendorLayoutComponent {
  protected readonly navItems = VENDOR_NAV_ITEMS;
}

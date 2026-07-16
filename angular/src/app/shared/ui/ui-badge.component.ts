import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-badge',
  standalone: true,
  template: `
    <span class="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-primary">
      {{ label() }}
    </span>
  `
})
export class UiBadgeComponent {
  readonly label = input.required<string>();
}

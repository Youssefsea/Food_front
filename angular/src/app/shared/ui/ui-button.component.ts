import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a
      [routerLink]="link()"
      class="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
    >
      {{ label() }}
    </a>
  `
})
export class UiButtonComponent {
  readonly label = input.required<string>();
  readonly link = input.required<string>();
}

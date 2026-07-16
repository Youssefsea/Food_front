import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-card',
  standalone: true,
  template: `
    <article class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <h3 class="mb-1 text-lg font-bold text-dark">{{ title() }}</h3>
      <p class="text-sm text-muted">{{ description() }}</p>
    </article>
  `
})
export class UiCardComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}

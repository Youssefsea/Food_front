import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-modal',
  standalone: true,
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div class="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
          <h3 class="text-xl font-black text-dark">{{ title() }}</h3>
          <p class="mt-2 text-sm text-muted">{{ description() }}</p>
        </div>
      </div>
    }
  `
})
export class UiModalComponent {
  readonly open = input(false);
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}

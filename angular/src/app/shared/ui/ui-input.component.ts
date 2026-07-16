import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-input',
  standalone: true,
  template: `
    <label class="block space-y-2">
      <span class="text-sm font-semibold text-dark">{{ label() }}</span>
      <input
        [type]="type()"
        [placeholder]="placeholder()"
        class="w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-dark outline-none ring-primary/20 transition focus:ring"
      />
    </label>
  `
})
export class UiInputComponent {
  readonly label = input.required<string>();
  readonly placeholder = input<string>('');
  readonly type = input<'text' | 'email' | 'password' | 'number'>('text');
}

import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PAGE_DATA } from './page-data';
import { UiButtonComponent } from '../../shared/ui/ui-button.component';
import { UiCardComponent } from '../../shared/ui/ui-card.component';
import { UiBadgeComponent } from '../../shared/ui/ui-badge.component';
import { UiInputComponent } from '../../shared/ui/ui-input.component';
import { UiModalComponent } from '../../shared/ui/ui-modal.component';

@Component({
  selector: 'app-route-page',
  standalone: true,
  imports: [UiButtonComponent, UiCardComponent, UiBadgeComponent, UiInputComponent, UiModalComponent],
  template: `
    <section class="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-8">
      <header class="rounded-3xl gradient-primary p-6 text-white shadow-lg">
        <p class="mb-1 text-sm font-medium opacity-90">{{ currentPath() }}</p>
        <h1 class="mb-2 text-3xl font-black">{{ page().title }}</h1>
        <p class="max-w-3xl text-sm md:text-base">{{ page().subtitle }}</p>
      </header>

      <div class="flex items-center gap-3">
        <app-ui-badge label="Angular Standalone" />
        <app-ui-badge label="Tailwind CSS" />
      </div>

      <div class="grid gap-4 rounded-2xl bg-white p-4 ring-1 ring-orange-100 md:grid-cols-2">
        <app-ui-input label="بحث سريع" placeholder="ابحث عن مطعم أو طبق" />
        <button
          type="button"
          class="self-end rounded-xl border border-primary px-4 py-3 text-sm font-semibold text-primary"
          (click)="showModal.set(true)"
        >
          معاينة نافذة منبثقة
        </button>
      </div>

      @if (page().quickActions?.length) {
        <div class="flex flex-wrap gap-3">
          @for (action of page().quickActions; track action.link) {
            <app-ui-button [label]="action.label" [link]="action.link" />
          }
        </div>
      }

      <div class="grid gap-4 md:grid-cols-2">
        @for (section of page().sections; track section.title) {
          <app-ui-card [title]="section.title" [description]="section.description" />
        }
      </div>

      @if (paramEntries().length) {
        <article class="rounded-2xl border border-orange-200 bg-white p-4">
          <h2 class="mb-3 text-lg font-bold text-dark">معاملات الرابط</h2>
          <ul class="space-y-2 text-sm text-muted">
            @for (entry of paramEntries(); track entry.key) {
              <li><span class="font-semibold text-dark">{{ entry.key }}:</span> {{ entry.value }}</li>
            }
          </ul>
        </article>
      }

      <app-ui-modal
        [open]="showModal()"
        title="نموذج Modal"
        description="تم تحويل مكونات النوافذ المنبثقة إلى مكون Angular قابل لإعادة الاستخدام."
      />
    </section>
  `
})
export class RoutePageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly showModal = signal(false);

  protected readonly page = computed(() => {
    const key = this.route.snapshot.data['pageKey'] as string;
    return PAGE_DATA[key] ?? PAGE_DATA['home'];
  });

  protected readonly currentPath = computed(() => this.route.snapshot.routeConfig?.path ?? '/');

  protected readonly paramEntries = computed(() =>
    Object.entries(this.route.snapshot.params ?? {}).map(([key, value]) => ({ key, value: String(value) }))
  );
}

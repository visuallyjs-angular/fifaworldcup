import { Component, Input, inject } from '@angular/core';
import { FifaService } from '../services/fifa.service';

@Component({
  selector: 'app-select-something',
  standalone: true,
  template: `
    <div class="vjs-fwc-empty-state">
        <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="vjs-fwc-empty-icon"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div class="vjs-fwc-empty-text">{{msg}}</div>
    </div>
  `
})
export class SelectSomethingComponent {
  fifaService = inject(FifaService);
  @Input() msg: string = '';
}

import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FifaService } from '../services/fifa.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="vjs-fwc-header">
        <div class="vjs-fwc-header-title">
            FIFA World Cup {{year}}
        </div>
        <nav class="vjs-fwc-header-nav">
            <button (click)="onViewChange.emit('teams')" class="vjs-fwc-header-link">
                Teams
            </button>
            <button (click)="onViewChange.emit('group-stage')" class="vjs-fwc-header-link">
                Group Stage
            </button>
            <button (click)="onViewChange.emit('tournament')" class="vjs-fwc-header-link">
                Tournament
            </button>
        </nav>
    </header>
  `
})
export class HeaderComponent {
  fifaService = inject(FifaService);
  @Input() year: number = 2026;
  @Output() onViewChange = new EventEmitter<string>();
}

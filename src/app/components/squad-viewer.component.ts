import { Component, Input, inject } from '@angular/core';
import { PlayerComponent } from './player.component';
import { CommonModule } from '@angular/common';
import { FifaService } from '../services/fifa.service';

@Component({
  selector: 'app-squad-viewer',
  standalone: true,
  imports: [PlayerComponent],
  template: `
    @if (squad) {
        <div class="vjs-wc-squad-info" style="padding:10px">
            <h3>PLAYERS</h3>
            <div style="display:flex; flex-wrap:wrap">
                @for (p of squad.players; track p.name) {
                    <app-player [player]="p"></app-player>
                }
            </div>
        </div>
    }
  `
})
export class SquadViewerComponent {
  fifaService = inject(FifaService);
  @Input() squad: any;
}

import { Component, Input, inject } from '@angular/core';
import { FifaService } from '../services/fifa.service';

@Component({
  selector: 'app-player',
  standalone: true,
  template: `
    <div style="border: 1px solid #ccc; border-radius: 4px; padding: 8px; margin: 4px; width: 200px; font-size: 0.85rem; background-color: #f9f9f9; display: flex; flex-direction: column; gap: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 4px;">
            <span style="font-weight: bold;">{{player.name}}</span>
            <span style="color: #666;">#{{player.number}}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <span>{{player.pos}}</span>
            <span>{{player.date_of_birth}}</span>
        </div>
        <div style="font-size: 0.75rem; color: #555; margin-top: 2px;">
            {{player.club.name}} ({{player.club.country}})
        </div>
    </div>
  `
})
export class PlayerComponent {
  fifaService = inject(FifaService);
  @Input() player: any;
}

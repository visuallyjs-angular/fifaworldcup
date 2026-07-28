import { Component, Input, inject } from '@angular/core';
import { TeamFlagComponent } from './team-flag.component';
import { CommonModule } from '@angular/common';
import { FifaService } from '../services/fifa.service';

@Component({
  selector: 'app-team-viewer',
  standalone: true,
  imports: [TeamFlagComponent],
  template: `
    @if (team) {
        <div class="vjs-wc-team-info" style="padding: 10px; font-family: sans-serif;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px; background-color: #f3f3f3; padding: 10px;">
                <app-team-flag [team]="team"></app-team-flag>
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                <tbody>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Name</td>
                    <td style="padding: 8px 0; text-align: right;">{{team.name_normalised || team.name}}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Continent</td>
                    <td style="padding: 8px 0; text-align: right;">{{team.continent}}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">FIFA Code</td>
                    <td style="padding: 8px 0; text-align: right;">{{team.fifa_code}}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Confederation</td>
                    <td style="padding: 8px 0; text-align: right;">{{team.confed}}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Group</td>
                    <td style="padding: 8px 0; text-align: right;">{{team.group}}</td>
                </tr>
                </tbody>
            </table>
        </div>
    }
  `
})
export class TeamViewerComponent {
  fifaService = inject(FifaService);
  @Input() team: any;
}

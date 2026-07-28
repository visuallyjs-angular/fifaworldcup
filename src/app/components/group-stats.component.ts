import { Component, Input, computed, inject } from '@angular/core';
import { TeamFlagComponent } from './team-flag.component';
import { CommonModule } from '@angular/common';
import { FifaService } from '../services/fifa.service';

@Component({
  selector: 'app-group-stats',
  standalone: true,
  imports: [TeamFlagComponent],
  template: `
    @if (stats && stats.rankedTeams) {
        <div class="vjs-fwc-group-stats" style="padding: 10px; font-family: sans-serif; background-color: white; margin: 10px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1)">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                <thead>
                    <tr style="border-bottom: 2px solid #eee; text-align: left;">
                        <th style="padding: 8px 4px">#</th>
                        <th style="padding: 8px 4px">Team</th>
                        <th style="padding: 8px 4px; text-align: center">W</th>
                        <th style="padding: 8px 4px; text-align: center">D</th>
                        <th style="padding: 8px 4px; text-align: center">L</th>
                        <th style="padding: 8px 4px; text-align: center">F</th>
                        <th style="padding: 8px 4px; text-align: center">A</th>
                        <th style="padding: 8px 4px; text-align: center">GD</th>
                        <th style="padding: 8px 4px; text-align: center">P</th>
                    </tr>
                </thead>
                <tbody>
                    @for (team of stats.rankedTeams; track team.name) {
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 8px 4px">{{$index + 1}}</td>
                            <td style="padding: 8px 4px">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="width: 20px; height: 20px; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                                        <app-team-flag [team]="team"></app-team-flag>
                                    </div>
                                    <span>{{team.name}}</span>
                                </div>
                            </td>
                            <td style="padding: 8px 4px; text-align: center">{{stats.wins[team.name]}}</td>
                            <td style="padding: 8px 4px; text-align: center">{{stats.draws[team.name]}}</td>
                            <td style="padding: 8px 4px; text-align: center">{{stats.losses[team.name]}}</td>
                            <td style="padding: 8px 4px; text-align: center">{{stats.goalsFor[team.name]}}</td>
                            <td style="padding: 8px 4px; text-align: center">{{stats.goalsAgainst[team.name]}}</td>
                            <td style="padding: 8px 4px; text-align: center">{{getGD(team.name)}}</td>
                            <td style="padding: 8px 4px; text-align: center; font-weight: bold;">{{stats.points[team.name]}}</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    }
  `
})
export class GroupStatsComponent {
  fifaService = inject(FifaService);
  @Input() stats: any;

  getGD(name: string) {
    const gd = this.stats.goalsFor[name] - this.stats.goalsAgainst[name];
    return gd > 0 ? `+${gd}` : gd;
  }
}

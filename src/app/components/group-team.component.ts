import {Component, Input, computed, OnInit, inject} from '@angular/core';
import { TeamFlagComponent } from './team-flag.component';
import { CommonModule } from '@angular/common';
import {BaseNodeComponent} from "@visuallyjs/browser-ui-angular";
import { FifaService } from '../services/fifa.service';

@Component({
  selector: 'app-group-team',
  standalone: true,
  imports: [TeamFlagComponent],
  template: `
    <div class="vjs-fwc-group-team-node" [attr.data-ranking]="rank()">
        <div class="vjs-fwc-group-team" [attr.title]="data.name"><app-team-flag [team]="data"></app-team-flag></div>
        @if (!showStatsTable) {
            <div class="vjs-fwc-group-team-stats">
                <span style="white-space:nowrap">{{data.name}}</span>
                @if (stats) {
                    <table style="color:#555555">
                        <thead>
                        <tr>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>F</th>
                            <th>A</th>
                            <th>P</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{{stats.wins[data.name]}}</td>
                            <td>{{stats.draws[data.name]}}</td>
                            <td>{{stats.losses[data.name]}}</td>
                            <td>{{stats.goalsFor[data.name]}}</td>
                            <td>{{stats.goalsAgainst[data.name]}}</td>
                            <td>{{stats.points[data.name]}}</td>
                        </tr>
                        </tbody>
                    </table>
                }
            </div>
        }
        @if (showStatsTable) {
            <span style="margin-left:10px">{{data.name}}</span>
        }
    </div>
  `
})
export class GroupTeamComponent extends BaseNodeComponent implements OnInit {
  fifaService = inject(FifaService);
  @Input() stats: any;
  @Input() showStatsTable: boolean = false;

    rank = computed(() => {
    if (this.stats == null) {
      return -1;
    } else {
      return this.stats.rankings[this.data.name];
    }
  });
}

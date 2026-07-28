import { Component, Input, OnInit, signal, effect, inject } from '@angular/core';
import { TeamFlagComponent } from './team-flag.component';
import { CommonModule } from '@angular/common';
import { FifaService } from '../services/fifa.service';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [TeamFlagComponent],
  template: `
    <div class="vjs-fwc-teams-list">
        @for (team of teams(); track team.name) {
            <div 
                [class]="'vjs-fwc-teams-list-item' + (isSelected(team) ? ' vjs-fwc-teams-list-item-selected' : '')"
                (click)="onTeamClick(team)"
            >
                <div class="vjs-fwc-teams-list-item-flag">
                    <app-team-flag [team]="team"></app-team-flag>
                </div>
                <div class="vjs-fwc-teams-list-item-details">
                    <div class="vjs-fwc-teams-list-item-name">{{team.name}}</div>
                    <div class="vjs-fwc-teams-list-item-info">
                        <span>{{team.continent}}</span>
                        <span class="vjs-fwc-teams-list-item-separator">|</span>
                        <span>{{team.confed}}</span>
                        <span class="vjs-fwc-teams-list-item-separator">|</span>
                        <span>Group {{team.group}}</span>
                    </div>
                </div>
            </div>
        }
    </div>
  `
})
export class TeamsListComponent implements OnInit {
  fifaService = inject(FifaService);
  @Input() selectedTeam: any;

  teams = signal<any[]>([]);

  ngOnInit() {
      this.fifaService.ds.getTeams().then((t: any[]) => {
          const sortedTeams = [...t].sort((a, b) => a.name.localeCompare(b.name));
          this.teams.set(sortedTeams);
      });
  }

  isSelected(team: any) {
    return this.selectedTeam && this.selectedTeam.name === team.name;
  }

  onTeamClick(team: any) {
      this.fifaService.teamTap(team);
      this.fifaService.matchTap(null);
  }
}

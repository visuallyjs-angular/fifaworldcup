import { Component, Input, OnInit, signal, inject } from '@angular/core';
import { TeamFlagComponent } from './team-flag.component';
import { CommonModule } from '@angular/common';
import { FifaService } from '../services/fifa.service';
import {BaseNodeComponent} from "@visuallyjs/browser-ui-angular";
import {Match} from "@visuallyjs/open-football-worldcup-datasource";

@Component({
  selector: 'app-match-summary',
  standalone: true,
  imports: [TeamFlagComponent],
  template: `
    @if (data) {
        <div class="vjs-fwc-match-summary">
            <div class="vjs-fwc-match-team-row" (click)="fifaService.teamTap(team1())">
                <div class="vjs-fwc-group-team"><app-team-flag [team]="team1()"></app-team-flag></div>
                <span class="vjs-fwc-match-team-name">{{team1()?.name}}</span>
                <span class="vjs-fwc-match-team-score">
                    {{finalScore(0)}}
                    @if (data.score.p) { ({{data.score.p[0]}}) }
                </span>
            </div>
            <div class="vjs-fwc-match-team-row" (click)="fifaService.teamTap(team2())">
                <div class="vjs-fwc-group-team"><app-team-flag [team]="team2()"></app-team-flag></div>
                <span class="vjs-fwc-match-team-name">{{team2()?.name}}</span>
                <span class="vjs-fwc-match-team-score">
                    {{finalScore(1)}}
                    @if (data.score.p) { ({{data.score.p[1]}}) }
                </span>
            </div>
        </div>
    }
  `
})
export class MatchSummaryComponent extends BaseNodeComponent implements OnInit {
  fifaService = inject(FifaService);

  @Input() match?:Match|undefined

  team1 = signal<any>(null);
  team2 = signal<any>(null);

  override ngOnInit() {
      super.ngOnInit()
      if (this.match != null) {
          this.data = this.match
      }

    if (this.data.team1) {
      this.fifaService.ds.getTeam(this.data.team1).then((t: any) => this.team1.set(t));
    }
    if (this.data.team2) {
      this.fifaService.ds.getTeam(this.data.team2).then((t: any) => this.team2.set(t));
    }
  }

  finalScore(idx: number) {
    return this.data.score.et ? this.data.score.et[idx] : this.data.score.ft[idx];
  }
}

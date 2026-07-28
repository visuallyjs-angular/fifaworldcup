import { Component, Input, inject } from '@angular/core';
import { MatchSummaryComponent } from "./match-summary.component";
import { CommonModule } from '@angular/common';
import {BaseNodeComponent} from "@visuallyjs/browser-ui-angular";
import { FifaService } from '../services/fifa.service';

@Component({
  selector: 'app-team-journey-match',
  standalone: true,
  imports: [MatchSummaryComponent],
  template: `
    <div class="vjs-fwc-team-journey-item" style="width: 400px;">
        <div class="vjs-fwc-team-journey-item-summary">
            <app-match-summary [match]="$any(data)"></app-match-summary>
        </div>
        <div class="vjs-fwc-team-journey-item-details">
            <div class="vjs-fwc-team-journey-item-round">
                {{data.group ? data.group + ' - ' + data.round : data.round}}
            </div>
            <div class="vjs-fwc-team-journey-item-info">
                <span>{{data.date}}</span>
                <span class="vjs-fwc-team-journey-item-separator">|</span>
                <span>{{data.time}}</span>
            </div>
            <div class="vjs-fwc-team-journey-item-ground">
                {{data.ground}}
            </div>
        </div>
    </div>
  `
})
export class TeamJourneyMatchComponent extends BaseNodeComponent {
  fifaService = inject(FifaService);
}

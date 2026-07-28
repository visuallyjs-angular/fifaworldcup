import { Component, Input, inject } from '@angular/core';
import { FIFACountryCode } from '../fifa-converter';
import { CommonModule } from '@angular/common';
import { FifaService } from '../services/fifa.service';

@Component({
  selector: 'app-team-flag',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (team) {
        @if (isoCode()) {
            <img class="vjs-fwc-team-flag" [src]="'https://static.visuallyjs.com/img/flags/1x1/' + isoCode() + '.svg'"/>
        } @else {
            <span>{{team.fifa_code}}</span>
        }
    }
  `
})
export class TeamFlagComponent {
  fifaService = inject(FifaService);
  @Input() team: any;

  isoCode() {
    return FIFACountryCode(this.team?.fifa_code)?.ISO2?.toLowerCase();
  }
}

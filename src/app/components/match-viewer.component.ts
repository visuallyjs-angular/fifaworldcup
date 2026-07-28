import { Component, Input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FifaService } from '../services/fifa.service';

@Component({
  selector: 'app-match-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (!match) {
        <div class="vjs-fwc-empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="vjs-fwc-empty-icon">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div class="vjs-fwc-empty-text">Select a match to view details</div>
        </div>
    } @else {
        <div class="vjs-fwc-match-viewer">
            <div class="vjs-fwc-match-viewer-header">
                <div class="vjs-fwc-match-viewer-round">{{match.round}} {{match.group ? '(' + match.group + ')' : ''}}</div>
                <div class="vjs-fwc-match-viewer-meta">Match {{match.num}}</div>
            </div>

            <div class="vjs-fwc-match-viewer-teams">
                <div class="vjs-fwc-match-viewer-team">
                    <div class="vjs-fwc-match-viewer-team-name">{{match.team1}}</div>
                </div>
                <div class="vjs-fwc-match-viewer-score-container">
                    <div class="vjs-fwc-match-viewer-score">
                        <div class="vjs-fwc-match-viewer-score-main">{{scoreText()}}</div>
                    </div>
                </div>
                <div class="vjs-fwc-match-viewer-team">
                    <div class="vjs-fwc-match-viewer-team-name">{{match.team2}}</div>
                </div>
            </div>

            @if (match.score.p) {
                <div class="vjs-fwc-match-viewer-score-penalties-extra">
                    ({{match.score.p[0]}} - {{match.score.p[1]}} pen)
                </div>
            } @else if (match.score.et) {
                <div class="vjs-fwc-match-viewer-extra-time">Extra time</div>
            }

            <div class="vjs-fwc-match-viewer-info">
                <div class="vjs-fwc-match-viewer-info-item">
                    <span class="vjs-fwc-match-viewer-label">Date:</span> {{match.date}}
                </div>
                <div class="vjs-fwc-match-viewer-info-item">
                    <span class="vjs-fwc-match-viewer-label">Time:</span> {{match.time}}
                </div>
                <div class="vjs-fwc-match-viewer-info-item">
                    <span class="vjs-fwc-match-viewer-label">Stadium:</span> {{match.ground}}
                </div>
            </div>

            <div class="vjs-fwc-match-viewer-goals">
                <div class="vjs-fwc-match-viewer-section-title">Goals</div>
                @if (allGoals().length > 0) {
                    <div class="vjs-fwc-match-viewer-goals-list">
                        @for (goal of allGoals(); track $index) {
                            <div [class]="'vjs-fwc-match-viewer-goal-item team-' + goal.team">
                                <span class="vjs-fwc-match-viewer-goal-minute">{{goal.minute}}'</span>
                                <span class="vjs-fwc-match-viewer-goal-name">{{goal.name}}</span>
                                @if (goal.penalty) { <span class="vjs-fwc-match-viewer-goal-type">(P)</span> }
                                @if (goal.owngoal) { <span class="vjs-fwc-match-viewer-goal-type">(OG)</span> }
                            </div>
                        }
                    </div>
                } @else {
                    <div class="vjs-fwc-match-viewer-no-goals">No goals recorded</div>
                }
            </div>
        </div>
    }
  `
})
export class MatchViewerComponent {
  fifaService = inject(FifaService);
  @Input() match: any;

  scoreText = computed(() => {
    if (!this.match) return '';
    const ft = this.match.score.ft || [0, 0];
    const et = this.match.score.et;
    if (et) {
      return `${et[0]} - ${et[1]}`;
    }
    return `${ft[0]} - ${ft[1]}`;
  });

  allGoals = computed(() => {
    if (!this.match) return [];
    const goals1 = (this.match.goals1 || []).map((g: any) => ({ ...g, team: 1 }));
    const goals2 = (this.match.goals2 || []).map((g: any) => ({ ...g, team: 2 }));
    
    return [...goals1, ...goals2].sort((a, b) => {
        const parseMinute = (m: any) => {
            if (typeof m === 'number') return m;
            const match = String(m).match(/^(\d+)/);
            return match ? parseInt(match[1]) : 0;
        };
        const minA = parseMinute(a.minute);
        const minB = parseMinute(b.minute);
        if (minA !== minB) return minA - minB;
        
        const parseExtra = (m: any) => {
            const match = String(m).match(/\+(\d+)/);
            return match ? parseInt(match[1]) : 0;
        };
        return parseExtra(a.minute) - parseExtra(b.minute);
    });
  });
}

import { Component, Input, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { AnchorLocations, CircularLayout, LabelOverlay } from "@visuallyjs/browser-ui";
import { VisuallyJsModule } from "@visuallyjs/browser-ui-angular";
import { GroupTeamComponent } from "./group-team.component";
import { GroupStatsComponent } from "./group-stats.component";
import { CommonModule } from '@angular/common';
import { FifaService } from '../services/fifa.service';

@Component({
  selector: 'app-group-viewer',
  standalone: true,
  imports: [VisuallyJsModule, GroupStatsComponent, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div [class]="'vjs-fwc-group' + (showStatsTable() ? ' vjs-fwc-group-with-stats' : '')" style="position: relative;">
        <div class="vjs-fwc-group-title">{{groupName}}</div>
        <div 
            class="vjs-fwc-group-stats-toggle" 
            (click)="toggleStatsTable()"
            style="position: absolute; top: 10px; right: 10px; cursor: pointer; padding: 4px; border-radius: 4px; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s;"
            [style.background-color]="showStatsTable() ? '#d0d0d0' : 'transparent'"
            [title]="showStatsTable() ? 'Hide stats table' : 'Show stats table'"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
                <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
        </div>
        @if(loaded()) {
			<vjs-paper [modelOptions]="modelOptions" [data]="data()" [renderOptions]="renderOptions" [viewOptions]="view"></vjs-paper>    
        }
        
        @if (showStatsTable()) {
            <app-group-stats [stats]="stats()"></app-group-stats>
        }
    </div>
  `
})
export class GroupViewerComponent implements OnInit {
  fifaService = inject(FifaService);
  @Input() year: number = 2026;
  @Input() groupName: string = '';
  @Input() initialShowStatsTable: boolean = false;

  loaded = signal(false)
  data = signal<any>({});
  stats = signal<any>({});
  showStatsTable = signal<boolean>(false);

  modelOptions = {
    groupProperty: "vjsGroup"
  };

  renderOptions = {
    layout: {
      type: CircularLayout.type,
      options: { }
    }
  };

  view = {
    nodes: {
      default: {
        component: GroupTeamComponent,
        events: {
          "mouseover": (p: any) => {
            p.model.addToSelection(p.obj.getAllEdges());
          },
          "mouseout": (p: any) => {
            p.model.removeFromSelection(p.obj.getAllEdges());
          },
          "tap": (p: any) => this.fifaService.teamTap(p.obj.data)
        }
      }
    },
    edges: {
      default: {
        detachable: false,
        anchor: AnchorLocations.Center,
        overlays: [
          {
            type: LabelOverlay.type,
            options: {
              label: "{{team1Score}}",
              location: 0.35
            }
          },
          {
            type: LabelOverlay.type,
            options: {
              label: "{{team2Score}}",
              location: 0.65
            }
          }
        ],
        events: {
          "tap": (p: any) => {
            this.fifaService.matchTap(p.obj.data.match);
          },
          "mouseover": (p: any) => {
            p.model.addToSelection(p.obj);
          },
          "mouseout": (p: any) => {
            p.model.removeFromSelection(p.obj);
          },
        }
      }
    }
  };

  paperChildProps() {
    return {
        stats: this.stats(),
        showStatsTable: this.showStatsTable()
    }
  }

  ngOnInit() {
    this.showStatsTable.set(this.initialShowStatsTable);
    this.fifaService.ds.getGroupStats(this.groupName).then((stats: any) => {
      const nodes = stats.teams.slice();
      const edges = stats.matches.map((match: any) => {
        return {
          source: match.team1,
          target: match.team2,
          data: {
            team1Score: `${match.score.ft[0]}`,
            team2Score: `${match.score.ft[1]}`,
            match
          }
        };
      });
      this.data.set({ nodes, edges });
      this.stats.set(stats.stats);
      this.loaded.set(true)
    });
  }

  toggleStatsTable() {
    this.showStatsTable.set(!this.showStatsTable());
  }
}

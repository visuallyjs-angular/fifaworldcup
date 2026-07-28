import { Component, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { uuid } from "@visuallyjs/browser-ui";
import { VisuallyJsModule } from "@visuallyjs/browser-ui-angular";
import { MatchSummaryComponent } from "./match-summary.component";
import { FifaService } from '../services/fifa.service';

@Component({
  selector: 'app-tournament',
  standalone: true,
  imports: [VisuallyJsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="vjs-fwc-tournament-placeholder">
        <vjs-surface [data]="data()" [renderOptions]="renderOptions" [viewOptions]="viewOptions">
            <vjs-controls [clear]="false" [undoRedo]="false"></vjs-controls>
        </vjs-surface>
    </div>
  `
})
export class TournamentComponent implements OnInit {
  fifaService = inject(FifaService);

  data = signal<any>(null);

  renderOptions = {
    layout: {
        type: "Hierarchy",
        options: {
            invert: true,
            axis: "vertical",
            unattachedRootPadding: 0,
            padding: {
                x: 160, y: 40
            }
        }
    },
    edges: {
        connector: "Orthogonal",
        overlays: [
            {
                type: "PlainArrow",
                options: {
                    direction: -1,
                    location: 0
                }
            }
        ]
    },
    zoomToFit: true,
    elementsDraggable: false
  };

  viewOptions = {
    nodes: {
        default: {
            component: MatchSummaryComponent,
            events: {
                "tap": (p: any) => {
                    this.fifaService.matchTap(p.obj.data);
                    p.model.setSelection(p.obj);
                }
            }
        }
    }
  };

  ngOnInit() {
    this.assemble();
  }

  async assemble() {
    const getMatches = async (roundName: string) => {
      const matches = await this.fifaService.ds.getMatchesForRound(roundName);
      return matches.map((o: any) => Object.assign({ id: uuid() }, o));
    };

    const r32 = await getMatches("Round of 32");
    const r16 = await getMatches("Round of 16");
    const qf = await getMatches("Quarter-final");
    const sf = await getMatches("Semi-final");
    const f = await getMatches("Final");

    const nodes = [f[0], ...sf, ...qf, ...r16, ...r32];
    const edges: any[] = [];

    const findPreviousMatches = (focusMatch: any, matchList: any[]) => {
      return matchList.filter(m => m.team1 === focusMatch.team1 || m.team2 === focusMatch.team1 || m.team1 === focusMatch.team2 || m.team2 === focusMatch.team2);
    };

    sf.forEach((m: any) => {
        edges.push({ source: f[0].id, target: m.id });
        const quarters = findPreviousMatches(m, qf);
        quarters.forEach(q => {
            edges.push({ source: m.id, target: q.id });
            const ros = findPreviousMatches(q, r16);
            ros.forEach(rs => {
                edges.push({ source: q.id, target: rs.id });
                const rot = findPreviousMatches(rs, r32);
                rot.forEach(rt => {
                    edges.push({ source: rs.id, target: rt.id });
                });
            });
        });
    });

    this.data.set({ nodes, edges });
  }
}

import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    signal,
    CUSTOM_ELEMENTS_SCHEMA,
    inject,
    effect, computed
} from '@angular/core';
import { ColumnLayout, uuid } from "@visuallyjs/browser-ui";
import { VisuallyJsModule } from "@visuallyjs/browser-ui-angular";
import { TeamJourneyMatchComponent } from "./team-journey-match.component";
import { CommonModule } from '@angular/common';
import { FifaService } from '../services/fifa.service';
import {Team} from "@visuallyjs/open-football-worldcup-datasource";

@Component({
  selector: 'app-team-journey',
  standalone: true,
  imports: [VisuallyJsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="vjs-fwc-team-journey">
        <h3 style="margin: 0.5rem auto; text-align: center;">{{team?.name}}</h3>
        <vjs-paper
            [data]="data()"
            [modelOptions]="modelOptions"
            [renderOptions]="renderOptions"
            [viewOptions]="viewOptions">
        </vjs-paper>
    </div>
  `
})
export class TeamJourneyComponent  {
  fifaService = inject(FifaService);
  @Input() title: string = '';
  @Input() team:Team|null = null

  data = signal<any>(null);

  // team = computed(() => this.fifaService.selectedTeam())

  modelOptions = { groupProperty: "vjsGroup" };

  renderOptions = {
    scale: false,
    layout: {
        type: ColumnLayout.type,
        options: {
            padding: { x: 50, y: 20 }
        }
    },
    edges: {
        connector: "Straight",
        targetMarker: {
            type: "PlainArrow",
            options: { width: 10, length: 10 }
        }
    }
  };

  viewOptions = {
    nodes: {
        default: {
            component: TeamJourneyMatchComponent,
            events: {
                tap: (p: any) => {
                    p.model.setSelection(p.obj);
                    this.fifaService.matchTap(p.obj.data);
                }
            }
        }
    }
  };

    constructor() {
        effect(() => {
            this.team = this.fifaService.selectedTeam();
            if (this.team) {
                this.getTeamJourney();
            }
        });
    }

  async getTeamJourney() {
    if (this.team != null) {

        const groupName = `Group ${this.team.group}`;
        const groupStats = await this.fifaService.ds.getGroupStats(groupName);

        const teamGroupMatches = groupStats.matches
            .filter((m: any) => m.team1 === this.team!.name || m.team2 === this.team!.name)
            .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const journeyMatches = [...teamGroupMatches];

        const findMatchInRound = async (roundName: string) => {
            const matches = await this.fifaService.ds.getMatchesForRound(roundName);
            const match = matches.find((m: any) => m.team1 === this.team!.name || m.team2 === this.team!.name);
            if (match) {
                journeyMatches.push(match);
            }
        };

        await findMatchInRound("Round of 32");
        await findMatchInRound("Round of 16");
        await findMatchInRound("Quarter-final");
        await findMatchInRound("Semi-final");
        await findMatchInRound("Final");
        await findMatchInRound("Match for third place");

        const nodes = journeyMatches.map(m => ({...m, id: uuid()}));
        const edges = [];
        for (let i = 0; i < nodes.length - 1; i++) {
            edges.push({
                source: nodes[i].id,
                target: nodes[i + 1].id
            });
        }

        this.data.set({nodes, edges});
    }
  }
}

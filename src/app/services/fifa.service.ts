import {Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {Match, Squad, Team, WorldCupDatasource} from "@visuallyjs/open-football-worldcup-datasource";

@Injectable({
  providedIn: 'root'
})
export class FifaService {
    year = signal(2026);
    ds = new WorldCupDatasource({ year: this.year() });

    selectedTeam:WritableSignal<Team|null> = signal(null)
    selectedSquad:WritableSignal<Squad|null> = signal(null)
    selectedMatch:WritableSignal<Match|null> = signal(null)

  constructor() { }

    teamTap(team: Team) {
        this.selectedTeam.set(team);
        this.ds.getSquad(team.name).then((s: Squad) => {
            this.selectedSquad.set(s);
        });
    }

    matchTap(match: any) {
        this.selectedMatch.set(match);
        console.log("tap match ", match);
    }

    resetCurrent() {
        this.selectedTeam.set(null)
        this.selectedSquad.set(null)
        this.selectedMatch.set(null)
    }
}

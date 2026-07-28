import { Component, signal, inject } from '@angular/core';
import { FifaService } from "./services/fifa.service";
import { HeaderComponent } from "./components/header.component";
import { GroupStageComponent } from "./components/group-stage.component";
import { TournamentComponent } from "./components/tournament.component";
import { TeamsListComponent } from "./components/teams-list.component";
import { TeamJourneyComponent } from "./components/team-journey.component";
import { TeamViewerComponent } from "./components/team-viewer.component";
import { SquadViewerComponent } from "./components/squad-viewer.component";
import { MatchViewerComponent } from "./components/match-viewer.component";
import { SelectSomethingComponent } from "./components/select-something.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent, GroupStageComponent, TournamentComponent, TeamsListComponent,
    TeamJourneyComponent, TeamViewerComponent, SquadViewerComponent, MatchViewerComponent,
    SelectSomethingComponent, CommonModule
  ],
  templateUrl: './app.html'
})
export class App {
  fifaService = inject(FifaService);

  currentView = signal('group-stage');

  setCurrentView(view: string) {
    this.fifaService.resetCurrent()
    this.currentView.set(view);
  }
}

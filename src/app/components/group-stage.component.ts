import { Component, Input, OnInit, signal, inject } from '@angular/core';
import { GroupViewerComponent } from "./group-viewer.component";
import { CommonModule } from '@angular/common';
import { FifaService } from '../services/fifa.service';

@Component({
  selector: 'app-group-stage',
  standalone: true,
  imports: [GroupViewerComponent, CommonModule],
  template: `
    <div class="vjs-fwc-groups">
        @for (group of groups(); track group.name) {
            <app-group-viewer 
                [groupName]="group.name"
                [initialShowStatsTable]="showStatsTable">
            </app-group-viewer>
        }
    </div>
  `
})
export class GroupStageComponent implements OnInit {
  fifaService = inject(FifaService);
  @Input() showStatsTable: boolean = false;

  groups = signal<any[]>([]);

  ngOnInit() {
    this.fifaService.ds.getGroups().then((g: any[]) => this.groups.set(g));
  }
}

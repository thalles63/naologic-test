import { Component, signal } from "@angular/core";
import { TimelineComponent } from "../../components/timeline/timeline.component";
import { TimescaleSelectorComponent } from "../../components/timescale-selector/timescale-selector.component";
import { WorkcentersData } from "./data/work-centers";

@Component({
    standalone: true,
    templateUrl: "./home.component.html",
    imports: [TimelineComponent, TimescaleSelectorComponent]
})
export class HomeComponent {
    protected workCenters = signal(WorkcentersData);
}

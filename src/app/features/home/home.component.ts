import { Component } from "@angular/core";
import { TimelineComponent } from "../../components/timeline/timeline.component";
import { TimescaleSelectorComponent } from "../../components/timescale-selector/timescale-selector.component";

@Component({
    standalone: true,
    templateUrl: "./home.component.html",
    imports: [TimelineComponent, TimescaleSelectorComponent]
})
export class HomeComponent {}

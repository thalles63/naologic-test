import { Component, input } from "@angular/core";
import { WorkCenterDocument } from "../../shared/models/work-center.interface";

@Component({
    selector: "app-timeline",
    standalone: true,
    templateUrl: "./timeline.component.html",
    styleUrl: "./timeline.component.scss"
})
export class TimelineComponent {
    public readonly workCenters = input<WorkCenterDocument[]>([]);
}

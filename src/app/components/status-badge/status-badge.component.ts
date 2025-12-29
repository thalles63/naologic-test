import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { StatusEnum } from "../../shared/enums/status.enum";

@Component({
    selector: "app-status-badge",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./status-badge.component.html",
    styleUrl: "./status-badge.component.scss"
})
export class StatusBadgeComponent {
    public readonly status = input.required<StatusEnum>();

    public getLabel(status: StatusEnum): string {
        return status.replace("-", " ");
    }
}

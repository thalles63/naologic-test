import { Component, output, signal } from "@angular/core";
import { TimescaleEnum } from "../../shared/enums/timescale.enum";

@Component({
    selector: "app-timescale-selector",
    standalone: true,
    templateUrl: "./timescale-selector.component.html",
    styleUrl: "./timescale-selector.component.scss"
})
export class TimescaleSelectorComponent {
    public readonly timescaleChange = output<TimescaleEnum>();
    protected readonly currentScale = signal<TimescaleEnum>(TimescaleEnum.DAY);
    protected readonly timescaleEnum = TimescaleEnum;

    public setScale(scale: TimescaleEnum): void {
        this.currentScale.set(scale);
        this.timescaleChange.emit(scale);
    }
}

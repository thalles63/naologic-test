import { CommonModule } from "@angular/common";
import { Component, computed, input, model, signal } from "@angular/core";
import { TimescaleEnum } from "../../shared/enums/timescale.enum";
import { WorkCenterDocument } from "../../shared/models/work-center.interface";
import { WorkOrderDocument } from "../../shared/models/work-order.interface";

@Component({
    selector: "app-timeline",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./timeline.component.html",
    styleUrl: "./timeline.component.scss"
})
export class TimelineComponent {
    public readonly workCenters = input<WorkCenterDocument[]>([]);
    public readonly workOrders = model<WorkOrderDocument[]>([]);
    public readonly currentDate = signal(new Date());
    public readonly now = signal(new Date());
    public readonly viewMode = signal<TimescaleEnum>(TimescaleEnum.DAY);
    public readonly timescaleEnum = TimescaleEnum;
    private scrollAccumulator = 0;
    private readonly SCROLL_SENSITIVITY = 50;
    private isDragging = false;
    private lastMouseX = 0;

    public readonly columns = computed(() => {
        const mode = this.viewMode();
        const center = this.currentDate();
        const cols: Date[] = [];

        if (mode === TimescaleEnum.DAY) {
            // Show 14 days centered
            for (let i = -7; i <= 7; i++) {
                const d = new Date(center);
                d.setDate(d.getDate() + i);
                cols.push(d);
            }
        } else if (mode === TimescaleEnum.WEEK) {
            // Show 8 weeks centered
            for (let i = -4; i <= 4; i++) {
                const d = new Date(center);
                d.setDate(d.getDate() + i * 7);
                cols.push(d);
            }
        } else if (mode === TimescaleEnum.MONTH) {
            // Show 12 months centered
            for (let i = -6; i <= 6; i++) {
                const d = new Date(center);
                d.setMonth(d.getMonth() + i);
                d.setDate(1);
                cols.push(d);
            }
        }
        return cols;
    });

    public readonly viewportRange = computed(() => {
        const cols = this.columns();
        if (cols.length === 0) return { start: new Date(), end: new Date() };

        const start = new Date(cols[0]);
        const endLine = new Date(cols[cols.length - 1]);

        if (this.viewMode() === TimescaleEnum.DAY) {
            endLine.setDate(endLine.getDate() + 1);
        } else if (this.viewMode() === TimescaleEnum.WEEK) {
            endLine.setDate(endLine.getDate() + 7);
        } else if (this.viewMode() === TimescaleEnum.MONTH) {
            endLine.setMonth(endLine.getMonth() + 1);
        }

        return { start, end: endLine };
    });

    public updateViewMode(mode: TimescaleEnum) {
        this.viewMode.set(mode);
    }

    public onMouseDown(event: MouseEvent): void {
        if (event.button === 1) {
            event.preventDefault();
            this.isDragging = true;
            this.lastMouseX = event.clientX;
        }
    }

    public onMouseMove(event: MouseEvent): void {
        if (!this.isDragging) return;
        event.preventDefault();

        const deltaX = this.lastMouseX - event.clientX;
        this.scrollAccumulator += deltaX;

        if (Math.abs(this.scrollAccumulator) > this.SCROLL_SENSITIVITY) {
            const direction = this.scrollAccumulator > 0 ? 1 : -1;
            this.navigate(direction);
            this.scrollAccumulator = 0;
        }

        this.lastMouseX = event.clientX;
    }

    public onMouseUp(event: MouseEvent): void {
        if (event.button === 1) {
            this.isDragging = false;
        }
    }

    public onMouseLeave(): void {
        this.isDragging = false;
    }

    public onWheel(event: WheelEvent): void {
        event.preventDefault();

        const delta = event.deltaX !== 0 ? event.deltaX : event.deltaY;

        this.scrollAccumulator += delta;

        if (Math.abs(this.scrollAccumulator) > this.SCROLL_SENSITIVITY) {
            const direction = this.scrollAccumulator > 0 ? 1 : -1;
            this.navigate(direction);
            this.scrollAccumulator = 0;
        }
    }

    public navigate(direction: -1 | 1) {
        const mode = this.viewMode();
        const newDate = new Date(this.currentDate());

        if (mode === TimescaleEnum.DAY) {
            newDate.setDate(newDate.getDate() + direction);
        } else if (mode === TimescaleEnum.WEEK) {
            newDate.setDate(newDate.getDate() + direction * 7);
        } else if (mode === TimescaleEnum.MONTH) {
            newDate.setMonth(newDate.getMonth() + direction);
        }

        this.currentDate.set(newDate);
    }

    public getWorkOrdersForCenter(centerId: string): WorkOrderDocument[] {
        return this.workOrders().filter((wo) => wo.data.workCenterId === centerId);
    }

    public getItemStyle(workOrder: WorkOrderDocument) {
        const range = this.viewportRange();
        const totalDuration = range.end.getTime() - range.start.getTime();

        const start = new Date(workOrder.data.startDate).getTime();
        const end = new Date(workOrder.data.endDate).getTime();

        const left = ((start - range.start.getTime()) / totalDuration) * 100;
        const width = ((end - start) / totalDuration) * 100;

        return {
            left: `${left}%`,
            width: `${width}%`
        };
    }

    public getTodayPosition(): string {
        const now = this.now();
        const range = this.viewportRange();
        const totalDuration = range.end.getTime() - range.start.getTime();
        const current = now.getTime();

        if (current < range.start.getTime() || current > range.end.getTime()) {
            return "display: none";
        }

        const left = ((current - range.start.getTime()) / totalDuration) * 100;
        return `left: ${left}%`;
    }
}

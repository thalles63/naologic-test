import { CommonModule } from "@angular/common";
import { Component, computed, inject, input, model, signal } from "@angular/core";
import { StatusEnum } from "../../shared/enums/status.enum";
import { TimescaleEnum } from "../../shared/enums/timescale.enum";
import { WorkCenterDocument } from "../../shared/models/work-center.interface";
import { WorkOrderDocument } from "../../shared/models/work-order.interface";
import { SidebarService } from "../right-sidebar/right-sidebar.service";
import { StatusBadgeComponent } from "../status-badge/status-badge.component";
import { WorkOrderDetailsComponent } from "../work-order-details/work-order-details.component";

@Component({
    selector: "app-timeline",
    standalone: true,
    imports: [CommonModule, WorkOrderDetailsComponent, StatusBadgeComponent],
    templateUrl: "./timeline.component.html",
    styleUrl: "./timeline.component.scss"
})
export class TimelineComponent {
    private readonly sidebarService = inject(SidebarService);

    public readonly workCenters = input<WorkCenterDocument[]>([]);
    public readonly workOrders = model<WorkOrderDocument[]>([]);
    public readonly selectedWorkOrder = signal<WorkOrderDocument | null>(null);
    public readonly newOrderData = signal<{ workCenterId: string; date: Date } | null>(null);
    public readonly currentDate = signal(this.getLocalMidnight(new Date()));
    public readonly hoveredWorkCenterId = signal<string | null>(null);
    public readonly now = signal(new Date());
    public readonly viewMode = signal<TimescaleEnum>(TimescaleEnum.DAY);
    public readonly timescaleEnum = TimescaleEnum;
    public readonly statusEnum = StatusEnum;
    private scrollAccumulator = 0;
    private readonly SCROLL_SENSITIVITY = 50;
    private isDragging = false;
    private lastMouseX = 0;

    public readonly columns = computed(() => {
        const mode = this.viewMode();
        const center = this.getLocalMidnight(this.currentDate());
        const cols: Date[] = [];

        if (mode === TimescaleEnum.DAY) {
            // Show 14 days centered
            for (let i = -7; i <= 7; i++) {
                const d = new Date(center);
                d.setDate(d.getDate() + i);
                cols.push(d);
            }
        } else if (mode === TimescaleEnum.WEEK) {
            // Snap center to start of week (Sunday)
            const day = center.getDay();
            const diff = center.getDate() - day;
            const weekStart = new Date(center);
            weekStart.setDate(diff);

            // Show 8 weeks centered
            for (let i = -4; i <= 4; i++) {
                const d = new Date(weekStart);
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

    public getWeekHeaderLabel(date: Date): string {
        const start = new Date(date);
        const end = new Date(date);
        end.setDate(end.getDate() + 6);

        // Helper to format "28 Dec"
        const fmt = (d: Date) => {
            const day = d.getDate();
            const month = d.toLocaleString("en-US", { month: "short" });
            return `${day} ${month}`;
        };

        return `${fmt(start)} - ${fmt(end)}`;
    }

    public readonly viewportRange = computed(() => {
        const cols = this.columns();
        if (cols.length === 0) return { start: new Date(), end: new Date() };

        const start = new Date(cols[0]);
        start.setHours(0, 0, 0, 0);

        const endLine = new Date(cols[cols.length - 1]);
        endLine.setHours(0, 0, 0, 0);

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
        const newDate = this.getLocalMidnight(this.currentDate());

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

    // Helper to treat string dates as absolute local dates (ignoring timezone offsets of the source string)
    private getLocalMidnight(dateInput: Date | string): Date {
        if (dateInput instanceof Date) {
            const d = new Date(dateInput);
            d.setHours(0, 0, 0, 0);
            return d;
        }

        // Assume string is YYYY-MM-DD
        // We split and construct explicitly to avoid Date.parse() treating specific formats as UTC
        if (typeof dateInput === "string") {
            // Handle simple YYYY-MM-DD
            if (dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
                const [y, m, d] = dateInput.split("-").map(Number);
                return new Date(y, m - 1, d, 0, 0, 0, 0);
            }
            // Fallback for other formats (like ISO with time), though we should try to avoid them for "dates"
            const d = new Date(dateInput);
            d.setHours(0, 0, 0, 0);
            return d;
        }
        return new Date();
    }

    public getItemPosition(workOrder: WorkOrderDocument) {
        const range = this.viewportRange();
        const totalDuration = range.end.getTime() - range.start.getTime();

        const start = this.getLocalMidnight(workOrder.data.startDate).getTime();
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        const end = this.getLocalMidnight(workOrder.data.endDate).getTime() + ONE_DAY_MS;

        const left = ((start - range.start.getTime()) / totalDuration) * 100;
        const width = ((end - start) / totalDuration) * 100;

        return {
            left: `${left}%`,
            width: `${width}%`
        };
    }

    public readonly todayPosition = computed(() => {
        const now = this.now();
        const cols = this.columns();
        const mode = this.viewMode();

        const index = cols.findIndex((col) => {
            const colEnd = new Date(col);
            if (mode === TimescaleEnum.DAY) {
                colEnd.setDate(colEnd.getDate() + 1);
            } else if (mode === TimescaleEnum.WEEK) {
                colEnd.setDate(colEnd.getDate() + 7);
            } else if (mode === TimescaleEnum.MONTH) {
                colEnd.setMonth(colEnd.getMonth() + 1);
            }
            return now >= col && now < colEnd;
        });

        if (index === -1) {
            return "display: none";
        }

        const colStart = cols[index].getTime();
        const colEnd =
            mode === TimescaleEnum.DAY
                ? new Date(cols[index]).setDate(cols[index].getDate() + 1)
                : mode === TimescaleEnum.WEEK
                  ? new Date(cols[index]).setDate(cols[index].getDate() + 7)
                  : new Date(cols[index]).setMonth(cols[index].getMonth() + 1);

        const duration = colEnd - colStart;
        const offset = now.getTime() - colStart;
        const progressInCol = offset / duration;

        const colWidthPercent = 100 / cols.length;
        const left = index * colWidthPercent + progressInCol * colWidthPercent;
        return `left: ${left}%`;
    });

    public readonly todayBadgePosition = computed(() => {
        const now = this.now();
        const cols = this.columns();
        const mode = this.viewMode();

        const index = cols.findIndex((col) => {
            const colEnd = new Date(col);
            if (mode === TimescaleEnum.DAY) {
                colEnd.setDate(colEnd.getDate() + 1);
            } else if (mode === TimescaleEnum.WEEK) {
                colEnd.setDate(colEnd.getDate() + 7);
            } else if (mode === TimescaleEnum.MONTH) {
                colEnd.setMonth(colEnd.getMonth() + 1);
            }
            return now >= col && now < colEnd;
        });

        if (index === -1) {
            return "display: none";
        }

        const colWidthPercent = 100 / cols.length;
        const left = index * colWidthPercent + colWidthPercent / 2;
        return `left: ${left}%`;
    });

    public readonly todayLabel = computed(() => {
        const mode = this.viewMode();
        if (mode === TimescaleEnum.DAY) return "Today";
        if (mode === TimescaleEnum.WEEK) return "Current week";
        return "Current month";
    });

    public editOrder(wo: WorkOrderDocument) {
        this.newOrderData.set(null);
        this.selectedWorkOrder.set(wo);
        this.sidebarService.open();
    }

    public createOrder(workCenterId: string, startDate: Date) {
        const order = <WorkOrderDocument>{
            docId: "string",
            docType: "workOrder",
            data: {
                workCenterId: workCenterId,
                status: "open",
                startDate: [startDate.getFullYear(), String(startDate.getMonth() + 1).padStart(2, "0"), String(startDate.getDate()).padStart(2, "0")].join("-"),
                endDate: ""
            }
        };

        this.selectedWorkOrder.set(order);
        this.sidebarService.open();
    }

    public onWorkOrderSave(workOrder: WorkOrderDocument) {
        this.sidebarService.close();
        this.selectedWorkOrder.set(null);

        this.workOrders.update((wo) => {
            if (workOrder.docId) {
                const index = wo.findIndex((w) => w.docId === workOrder.docId);
                if (index !== -1) {
                    wo[index] = workOrder;
                }
            } else {
                wo.push(workOrder);
            }
            return wo;
        });
    }

    public onWorkOrderClose() {
        this.sidebarService.close();
        this.selectedWorkOrder.set(null);
    }
}

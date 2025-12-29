import { CommonModule } from "@angular/common";
import { Component, effect, inject, input, output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { StatusEnum } from "../../shared/enums/status.enum";
import { WorkCenterDocument } from "../../shared/models/work-center.interface";
import { WorkOrderDocument } from "../../shared/models/work-order.interface";
import { DateInputComponent } from "../date-input/date-input.component";
import { RightSidebarComponent } from "../right-sidebar/right-sidebar.component";
import { SidebarService } from "../right-sidebar/right-sidebar.service";
import { SelectInputComponent } from "../select-input/select-input.component";
import { StatusBadgeComponent } from "../status-badge/status-badge.component";

@Component({
    selector: "app-work-order-details",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RightSidebarComponent, SelectInputComponent, StatusBadgeComponent, DateInputComponent],
    templateUrl: "./work-order-details.component.html",
    styleUrl: "./work-order-details.component.scss"
})
export class WorkOrderDetailsComponent {
    private readonly fb = inject(FormBuilder);
    private readonly sidebarService = inject(SidebarService);

    public readonly workOrder = input<WorkOrderDocument | null>(null);
    public readonly workCenters = input<WorkCenterDocument[]>([]);
    public readonly allWorkOrders = input<WorkOrderDocument[]>([]);

    public readonly initialData = input<{ date: Date; workCenterId: string } | null>(null);

    public readonly onSave = output<WorkOrderDocument>();
    public readonly onClose = output<void>();

    private readonly toastr = inject(ToastrService);

    public readonly form = this.fb.group({
        name: ["", Validators.required],
        status: [StatusEnum.OPEN, Validators.required],
        startDate: ["", Validators.required],
        endDate: ["", Validators.required],
        workCenterId: ["", Validators.required]
    });

    public statusOptions = [
        { value: StatusEnum.OPEN, label: "Open" },
        { value: StatusEnum.IN_PROGRESS, label: "In Progress" },
        { value: StatusEnum.COMPLETE, label: "Complete" },
        { value: StatusEnum.BLOCKED, label: "Blocked" }
    ];

    constructor() {
        this.form.controls.status.valueChanges.pipe(takeUntilDestroyed()).subscribe((status) => {
            this.updateFormState(status as StatusEnum);
        });

        effect(() => {
            const wo = this.workOrder();
            const init = this.initialData();

            if (wo) {
                this.form.patchValue({
                    name: wo.data.name,
                    status: wo.data.status,
                    startDate: wo.data.startDate,
                    endDate: wo.data.endDate,
                    workCenterId: wo.data.workCenterId
                });
            } else if (init) {
                const dateStr = init.date.toISOString().split("T")[0];
                this.form.patchValue({
                    name: "",
                    status: StatusEnum.OPEN,
                    startDate: dateStr,
                    endDate: dateStr,
                    workCenterId: init.workCenterId
                });
            } else {
                this.form.reset({ status: StatusEnum.OPEN });
            }

            const currentStatus = this.form.controls.status.value as StatusEnum;
            this.updateFormState(currentStatus);
        });
    }

    private updateFormState(status: StatusEnum | null) {
        if (status === StatusEnum.BLOCKED) {
            this.form.controls.name.disable({ emitEvent: false });
            this.form.controls.startDate.disable({ emitEvent: false });
            this.form.controls.endDate.disable({ emitEvent: false });
            this.form.controls.workCenterId.disable({ emitEvent: false });
        } else {
            this.form.controls.name.enable({ emitEvent: false });
            this.form.controls.startDate.enable({ emitEvent: false });
            this.form.controls.endDate.enable({ emitEvent: false });
            this.form.controls.workCenterId.enable({ emitEvent: false });
        }
    }

    public save() {
        if (this.form.invalid) {
            this.toastr.error("Form is invalid", "Validation Error");
            return;
        }

        const val = this.form.getRawValue();
        const currentId = this.workOrder()?.docId;
        const start = new Date(val.startDate!);
        const end = new Date(val.endDate!);

        if (end < start) {
            this.toastr.error("End Date cannot be before Start Date", "Validation Error");
            return;
        }

        const overlaps = this.allWorkOrders().some((o) => {
            if (currentId && o.docId === currentId) return false;

            if (o.data.workCenterId !== val.workCenterId) return false;

            const oStart = new Date(o.data.startDate);
            const oEnd = new Date(o.data.endDate);

            return start <= oEnd && end >= oStart;
        });

        if (overlaps) {
            this.toastr.error("This period overlaps with another Work Order in the same Work Center", "Validation Error");
            return;
        }

        const wo: WorkOrderDocument = {
            docId: currentId || crypto.randomUUID(),
            docType: "workOrder",
            data: {
                name: val.name!,
                status: val.status as any,
                startDate: val.startDate!,
                endDate: val.endDate!,
                workCenterId: val.workCenterId!
            }
        };
        this.onSave.emit(wo);
    }

    public cancel() {
        this.sidebarService.close();
        this.onClose.emit();
    }
}

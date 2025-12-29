import { CommonModule } from "@angular/common";
import { Component, effect, inject, input, output } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { StatusEnum } from "../../shared/enums/status.enum";
import { WorkCenterDocument } from "../../shared/models/work-center.interface";
import { WorkOrderDocument } from "../../shared/models/work-order.interface";
import { RightSidebarComponent } from "../right-sidebar/right-sidebar.component";
import { SidebarService } from "../right-sidebar/right-sidebar.service";

@Component({
    selector: "app-work-order-details",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RightSidebarComponent],
    templateUrl: "./work-order-details.component.html",
    styleUrl: "./work-order-details.component.scss"
})
export class WorkOrderDetailsComponent {
    private readonly fb = inject(FormBuilder);
    private readonly sidebarService = inject(SidebarService);

    public readonly isOpen = input<boolean>(false);
    public readonly workOrder = input<WorkOrderDocument | null>(null);
    public readonly workCenters = input<WorkCenterDocument[]>([]);

    public readonly initialData = input<{ date: Date; workCenterId: string } | null>(null);

    public readonly onSave = output<WorkOrderDocument>();
    public readonly onClose = output<void>();

    public readonly form = this.fb.group({
        name: ["", Validators.required],
        status: [StatusEnum.OPEN, Validators.required],
        startDate: ["", Validators.required],
        endDate: ["", Validators.required],
        workCenterId: ["", Validators.required]
    });

    constructor() {
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
        });
    }

    public save() {
        if (this.form.invalid) return;

        const val = this.form.value;
        const wo: WorkOrderDocument = {
            docId: this.workOrder()?.docId || crypto.randomUUID(),
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

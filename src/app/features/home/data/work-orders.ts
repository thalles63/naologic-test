import { StatusEnum } from "../../../shared/enums/status.enum";
import { WorkOrderDocument } from "../../../shared/models/work-order.interface";

export const WorkOrdersData: WorkOrderDocument[] = [
    {
        docId: "wo-1",
        docType: "workOrder",
        data: {
            name: "WO-101 Extrusion",
            workCenterId: "b5ff12fa-dff6-42f0-a560-22859da5e31e",
            status: StatusEnum.IN_PROGRESS,
            startDate: "2025-07-28",
            endDate: "2025-12-30"
        }
    },
    {
        docId: "wo-2",
        docType: "workOrder",
        data: {
            name: "WO-102 CNC Long",
            workCenterId: "1b547b66-2b4c-440a-81ff-3ab20f5579e7",
            status: StatusEnum.OPEN,
            startDate: "2025-02-20",
            endDate: "2026-01-02"
        }
    },
    {
        docId: "wo-3",
        docType: "workOrder",
        data: {
            name: "WO-103 Assembly",
            workCenterId: "d1cb3ff2-1acd-4591-9718-b83b5da1e4a9",
            status: StatusEnum.COMPLETE,
            startDate: "2025-03-29",
            endDate: "2025-10-30"
        }
    },
    {
        docId: "wo-5",
        docType: "workOrder",
        data: {
            name: "WO-105 QC Check",
            workCenterId: "96639312-d902-496e-8ac6-2959c3f1e0bc",
            status: StatusEnum.BLOCKED,
            startDate: "2025-09-29",
            endDate: "2025-12-30"
        }
    },
    {
        docId: "wo-6",
        docType: "workOrder",
        data: {
            name: "WO-106 Packaging Batch",
            workCenterId: "9c6059ce-dc6d-4ac4-9d76-672b5da90e91",
            status: StatusEnum.COMPLETE,
            startDate: "2025-01-10",
            endDate: "2025-12-30"
        }
    },
    {
        docId: "wo-8",
        docType: "workOrder",
        data: {
            name: "WO-108 CNC Quick",
            workCenterId: "1b547b66-2b4c-440a-81ff-3ab20f5579e7",
            status: StatusEnum.IN_PROGRESS,
            startDate: "2026-01-03",
            endDate: "2026-07-07"
        }
    },
    {
        docId: "wo-9",
        docType: "workOrder",
        data: {
            name: "WO-109 Assembly Part 2",
            workCenterId: "d1cb3ff2-1acd-4591-9718-b83b5da1e4a9",
            status: StatusEnum.BLOCKED,
            startDate: "2025-12-31",
            endDate: "2026-05-02"
        }
    },
    {
        docId: "wo-10",
        docType: "workOrder",
        data: {
            name: "WO-110 QC Retest",
            workCenterId: "96639312-d902-496e-8ac6-2959c3f1e0bc",
            status: StatusEnum.COMPLETE,
            startDate: "2025-07-25",
            endDate: "2025-09-27"
        }
    },
    {
        docId: "wo-11",
        docType: "workOrder",
        data: {
            name: "WO-111 Packaging Bulk",
            workCenterId: "9c6059ce-dc6d-4ac4-9d76-672b5da90e91",
            status: StatusEnum.IN_PROGRESS,
            startDate: "2026-01-11",
            endDate: "2026-04-15"
        }
    }
];

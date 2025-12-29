import { StatusEnum } from "../enums/status.enum";

export interface WorkOrderDocument {
    docId: string;
    docType: "workOrder";
    data: {
        name: string;
        workCenterId: string;
        status: StatusEnum;
        startDate: string;
        endDate: string;
    };
}

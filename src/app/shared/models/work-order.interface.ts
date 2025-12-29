export type WorkOrderStatus = 'planned' | 'in-progress' | 'completed' | 'on-hold';

export interface WorkOrderDocument {
    docId: string;
    docType: 'workOrder';
    data: {
        name: string;
        workCenterId: string;
        status: WorkOrderStatus;
        startDate: string;
        endDate: string;
    };
}

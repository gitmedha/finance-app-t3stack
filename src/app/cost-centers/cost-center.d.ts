// Use a type-only export to avoid conflicts with isolatedModules
export type { costCenters, GetcostCentersResponse, FilterOptions, ItemDetailProps, ReportFilterFormProps };

interface costCenters {
    id: number;
    name: string;
    type: string;
    parentId: number;
    description: string | null;
    notes: string | null;
    isactive: boolean;
    createdAt: string; // typically stored as an ISO date string
    updatedAt: string | null;
    createdBy: number;
    updatedBy: number | null;
}

interface GetcostCentersResponse {
    costCenters: costCenters[];
    totalCount: number;
    totalPages: number;
}


interface FilterOptions {
    name: string;
    type: string;
    parentId: number;
    description: string | null;
    notes: string | null;
    isactive: boolean;
    createdAt: string; // typically stored as an ISO date string
}

interface ItemDetailProps {
    item: costCenters;
}

interface ReportFilterFormProps {
    filters: FilterOptions;
    handleSelect: (name: string, value: string) => void;
}

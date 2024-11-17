// Use a type-only export to avoid conflicts with isolatedModules
export type { costCenters, GetcostCentersResponse, FilterOptions, ItemDetailProps, CostCenterFilterFormProps };

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
    status: string;
    type: string;
}
interface ItemDetailProps {
    item: costCenters;
}

interface CostCenterFilterFormProps {
    filters: FilterOptions;
    handleSelect: (name: string, value: object) => void;
}
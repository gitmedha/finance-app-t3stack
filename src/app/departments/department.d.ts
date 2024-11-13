// Use a type-only export to avoid conflicts with isolatedModules
export type { Department, GetDepartmentResponse, FilterOptions, ItemDetailProps, DepartmentFilterFormProps };

interface Department {
    id: number;
    departmentname: string;
    type: string;
    deptCode?: number | null;
    isactive: boolean | string;
    notes?: string | null;
    description?: string | null;
    createdAt: string; // ISO date string format
    updatedAt?: string | null; // ISO date string format or null if not updated
    createdBy: number;
    updatedBy?: number | null;
  }
  
interface GetDepartmentResponse {
    departments: Department[];
    totalCount: number;
    totalPages: number;
}


interface FilterOptions {
    status: string;
    type: string;
}

interface ItemDetailProps {
    item: Department;
}

interface DepartmentFilterFormProps {
    filters: FilterOptions;
    handleSelect: (name: string, value: object) => void;
}

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
    departmentname: string;
    type: string;
    deptCode?: number | string;
    isactive: boolean | string;
    notes?: string | null;
    description?: string | null;
    createdAt: string; // ISO date string format
}

interface ItemDetailProps {
    item: Department;
}

interface DepartmentFilterFormProps {
    filters: FilterOptions;
    handleSelect: (name: string, value: string) => void;
}

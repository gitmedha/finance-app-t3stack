// Use a type-only export to avoid conflicts with isolatedModules
export type {
  Department,
  GetDepartmentResponse,
  FilterOptions,
  ItemDetailProps,
  DepartmentFilterFormProps,
  SelectValue,
  SelectDepartment,
};

interface Department {
  id: number;
  departmentname: string;
  type: string;
  deptCode?: number | null;
  isactive: boolean | string;
  notes?: string | null;
  description?: string | null;
  typeData: SelectValue;
  departmentData: SelectDepartment
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

interface SelectValue {
  value: string; // adjust according to the actual structure of value
  label: string;
}
interface SelectDepartment{
  value:number|undefined|null
  label:string|undefined|null
}
interface DepartmentFilterFormProps {
  filters: FilterOptions;
  handleSelect: (name: string, value: SelectValue) => void;
}

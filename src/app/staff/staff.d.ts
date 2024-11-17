// Use a type-only export to avoid conflicts with isolatedModules
export type { Staff, GetStaffsResponse, FilterOptions, StaffFilterFormProps };

interface Staff {
  id: number;
  name: string;
  isactive: boolean;
  description: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
  createdBy: number;
  updatedBy: number | null;
  empNo: string;
  department: number | null | string;
  departmentname: string | null;
  designation : string | null
}

interface GetStaffsResponse {
  staffs: Staff[];
  totalCount: number;
  totalPages: number;
}

interface FilterOptions {
  department: number | null | string;
  departmentname: string,
  status: string;
  designation: string;
}

interface StaffFilterFormProps {
  filters: FilterOptions;
  handleSelect: (name: string, value: object) => void;
}
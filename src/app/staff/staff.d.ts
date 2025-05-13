import { type ISelectItem } from "../common/types/genericField";

// Use a type-only export to avoid conflicts with isolatedModules
export type {
  StaffItem,
  GetStaffsResponse,
  FilterOptions,
  StaffFilterFormProps,
  StaffFormData
};

interface StaffItem {
  push(staff: { 
    id: number;
    name: string;
    empNo: string;
    isactive: boolean;
    notes: string | null;
    nature_of_employment: string | null;
    description: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    createdBy: number;
    updatedBy: number | null;
    department: number;
    departmentname: string | null;
    subDepartment: number;
    subDepartmentname: string | null;
    state: string | null;
    stateId: string | null;
    location: string | null;
    locationId: string | null;
    designation: string | null;
    level:number|null;
    project: string | null;
  }): unknown;
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
  department: number;
  departmentname: string;
  subDepartment: number;
  subDepartmentname: string;
  designation: string;
  nature_of_employment?: string;
  state?: string;
  location?: string;
  stateId?: string;
  locationId?: string;
  program?: string;
  project?: string;
  departmentData?: ISelectItem;
  subDeptData?:ISelectItem;
  statesData?: ISelectItem;
  locationData?: ISelectItem;
  levelData?:ISelectItem
  salary: string;
  insurance: string | null;
  bonus: string | null;
  gratuity: string | null;
  epf: string | null;
  pgwPld: string | null;
  salaryDetailsId: number | null;
  typeData?: ISelectItem;
}
interface StaffFormData {
  name: string;
  empNo: string;
  state: ISelectItem;
  location: ISelectItem;
  department: ISelectItem;
  subDepartmnet: ISelectItem;
  designation: string;
  isactive: boolean;
  natureOfEmployment: string;
  createdBy: number;
  createdAt: string; // Date in ISO format
}

interface SalaryDetails {
  salary: string;
  insurance: string | null;
  bonus: string | null;
  gratuity: string | null;
  epf: string | null;
  pgw_pld: string | null;
}

interface GetStaffsResponse {
  staffs: StaffItem[];
  totalCount: number;
  totalPages: number;
}

interface FilterOptions {
  department: number | string;
  departmentname: string;
  status: string;
  designation: string;
  subdepartment: number|string
  subdepartmentname: string
}

interface StaffFilterFormProps {
  filters: FilterOptions;
  handleSelect: (name: string, value: object) => void;
}

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
    state: string | null;
    stateId: string | null;
    location: string | null;
    locationId: string | null;
    designation: string | null;
    level:number|null
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
  designation: string;
  nature_of_employment?: string;
  state?: string;
  location?: string;
  stateId?: string;
  locationId?: string;
  program?: string;
  departmentData?: ISelectItem;
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
}
interface StaffFormData {
  name: string;
  empNo: string;
  state: ISelectItem;
  location: ISelectItem;
  department: ISelectItem;
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
  department: number | null | string;
  departmentname: string;
  status: string;
  designation: string;
}

interface StaffFilterFormProps {
  filters: FilterOptions;
  handleSelect: (name: string, value: object) => void;
}

export interface GetProgramActivitiesResponse {
  activities: ProgramActivityItem[];
  totalCount: number;
  totalPages: number;
}
  export interface Option {
    value: number | string
    label: string
  }

  export type FilterName = "department" | "subdepartment" | "status" | "financialYear"

  // 3. Your existing filters shape
export interface FilterValues {
  department:        number
  departmentname:    string
  subdepartment:     number
  subdepartmentname: string
  status:            string
  financialYear:     string
}

// 4. Now improve FilterProps to use those types
export interface FilterProps {
  filters: FilterValues
  // name must be one of FilterName, value must be an Option
  handleSelect: (name: FilterName, option: Option) => void
}


export interface ProgramActivityItem {
  id: number;
  name: string;
  description: string;
  departmentData: {
    value: number;
    label: string;
  } | null;
  subDepartmentData: {
    value: number;
    label: string;
  } | null;
  budgetData: {
    value: number;
    label: string;
  } | null;
  budgetYear: string;
  financialYear: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}



export interface FilterProps {
  filters: {
    department: number;
    departmentname: string;
    status: string;
    subdepartment: number;
    subdepartmentname: string;
    financialYear: string;
  };
  handleSelect: (name: string, value: object) => void;
}


interface AddNameProps {
  refetch: () => void;
  onSave: (name: string) => Promise<void>;
}

interface FormData {
  name: string;
}

export interface FormData {
  name: string;
  department: { value: number; label: string } | null;
  subDepartment: { value: number; label: string } | null;
  financialYear: { value: string; label: string } | null;
}

interface DeleteProps {
  item: ProgramActivityItem;
  refetchProgramActivities: () => void;
}

export interface EditProgramActivityProps {
  item: ProgramActivityItem;
  refetch: () => void;
}

export interface EditProgramActivityHandle {
  open: () => void;
  close: () => void;
}

export interface UpdateProgramActivityInput {
  id: number;
  name: string;
  description: string;
  departmentId: number;
  subDepartmentId: number | null;
  financialYear: string;
  isActive: boolean;
  updatedBy: number;
  updatedAt: string;
}

export interface FormValues {
  name: string;
  description: string;
  department: { value: number; label: string } | null;
  subDepartment: { value: number; label: string } | null;
  financialYear: string;
}
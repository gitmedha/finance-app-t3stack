import { type ISelectItem } from "../common/types/genericField";

// Use a type-only export to avoid conflicts with isolatedModules
export type { FilterOptions, BudgetFilterFormProps };

interface FilterOptions {
  department: string | number;  // Allow department to be string or number
  departmentname: string;
  year: string;
}

interface BudgetFilterFormProps {
  filters: FilterOptions;
  handleSelect: (name: string, value: number | string) => void;
}

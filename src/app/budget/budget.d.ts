import { type ISelectItem } from "../common/types/genericField";

// Use a type-only export to avoid conflicts with isolatedModules
export type { FilterOptions, BudgetFilterFormProps };

interface FilterOptions {
  department: string; // Department ID as string
  departmentname: string; // Department name as string
  year: string; // Year as string
}
interface BudgetFilterFormProps {
  filters: FilterOptions;
  handleSelect: (name: string, value: number | string | { id: number; departmentname: string }) => void;
  budgetId:number|null
  setBugetId:(val:number|null)=>void
}


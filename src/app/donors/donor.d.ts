// Use a type-only export to avoid conflicts with isolatedModules
export type { Donors, GetDonorsResponse, FilterOptions, ItemDetailProps, DonorFilterFormProps, SelectValue };

interface Donors {
  id: number;
  name: string;
  costCenter: number | null;
  finYear: number;
  totalBudget: number | string;
  budgetReceived: number | string;
  currency: string;
  notes: string | null;
  description: string | null;
  type: string | null;
  isactive: boolean;
  createdAt: string; // Date can be represented as ISO string
  updatedAt: string | null;
  createdBy: number;
  updatedBy: number | null;
}

interface GetDonorsResponse {
  donors: Donors[];
  totalCount: number;
  totalPages: number;
}


interface FilterOptions {
  status: string;
  type: string;
}

interface ItemDetailProps {
  item: Donors;
}

// 4. Typing handleSelect
interface SelectValue {
  value: string; // adjust according to the actual structure of value
}
interface DonorFilterFormProps {
  filters: FilterOptions;
  handleSelect: (name: string, value: SelectValue) => void;
}

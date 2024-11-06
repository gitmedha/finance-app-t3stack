// Use a type-only export to avoid conflicts with isolatedModules
export type { Staff, GetStaffsResponse };

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
  department: number | null;
}

interface GetStaffsResponse {
  staffs: Staff[];
  totalCount: number;
  totalPages: number;
}

export interface PersonnelCostProps {
    section: string;
    categoryId: number;
    deptId: string;
    budgetId: number;
    status: string | undefined;
    sectionOpen:
      | null
      | "PERSONNEL"
      | "Program Activities"
      | "Travel"
      | "PROGRAM OFFICE"
      | "CAPITAL COST"
      | "OVERHEADS";
    setSectionOpen: (
      val:
        | null
        | "PERSONNEL"
        | "Program Activities"
        | "Travel"
        | "PROGRAM OFFICE"
        | "CAPITAL COST"
        | "OVERHEADS",
    ) => void;
    travelCatId: number;
    subdepartmentId: number;
    financialYear: string;
  }
export interface LevelData {
    budgetDetailsId: number;
    Count: string | number;
    [month: string]: string | number; // Allow dynamic keys for months
  }

  export type TableData = Record<string, LevelData>;


  export interface qtySchema {
    Apr: number;
    May: number;
    Jun: number;
    Jul: number;
    Aug: number;
    Sep: number;
    Oct: number;
    Nov: number;
    Dec: number;
    Jan: number;
    Feb: number;
    Mar: number;
  }
  export interface totalschema {
    totalFY: number;
    totalQ1: number;
    totalQ2: number;
    totalQ3: number;
    totalQ4: number;
  }
  export type avgQtySchema = Record<string, qtySchema>;
  export interface PersonnelCostProps {
    onTotalsChange?: (totals: {
      totalQ1: number;
      totalQ2: number;
      totalQ3: number;
      totalQ4: number;
      totalFY: number;
    }) => void;
  }
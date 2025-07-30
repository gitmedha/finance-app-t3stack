export interface CapitalCostProps {
    section: string;
    categoryId: number;
    budgetId: number;
    deptId: string;
    status: string | undefined
    sectionOpen: null | "PERSONNEL" | "Program Activities" | "Travel" | "PROGRAM OFFICE" | "CAPITAL COST" | "OVERHEADS"
    setSectionOpen: (val: null | "PERSONNEL" | "Program Activities" | "Travel" | "PROGRAM OFFICE" | "CAPITAL COST" | "OVERHEADS") => void
    subdepartmentId: number
    financialYear:string
    onTotalsChange?: (totals: {
      totalQ1: number;
      totalQ2: number;
      totalQ3: number;
      totalQ4: number;
      totalFY: number;
    }) => void;
  }
  
 
  export interface totalschema {
    totalFY:number
    totalQ1: number
    totalQ2: number
    totalQ3: number
    totalQ4: number
  }
  export type TableData = Record<string, LevelData>;


  // import { type ISelectItem } from "../common/types/genericField";

// Export all types for use in other modules
export type {
    FilterOptions,
    BudgetFilterFormProps,
    ActivityBudgetProps,
    totalschema,
    subProgramActivitesSchema,
    LevelData,
    TableData,
    CapitalCostDataItem,
    BudgetDetailsPayload,
    BudgetDetailsCreate,
  };
  
  export interface LevelData {
    budgetDetailsId: number;
    // Count: string | number;
    "apr qty": number;
    "apr rate": number;
    "apr amount": number;
    april: number;
    "apr notes": string;
    "may qty": number;
    "may rate": number;
    "may amount": number;
    may: number;
    "may notes": string;
    "jun qty": number;
    "jun rate": number;
    "jun amount": number;
    june: number;
    "jun notes": string;
    "jul qty": number;
    "jul rate": number;
    "jul amount": number;
    july: number;
    "jul notes": string;
    "aug qty": number;
    "aug rate": number;
    "aug amount": number;
    august: number;
    "aug notes": string;
    "sep qty": number;
    "sep rate": number;
    "sep amount": number;
    september: number;
    "sep notes": string;
    "oct qty": number;
    "oct rate": number;
    "oct amount": number;
    october: number;
    "oct notes": string;
    "nov qty": number;
    "nov rate": number;
    "nov amount": number;
    november: number;
    "nov notes": string;
    "dec qty": number;
    "dec rate": number;
    "dec amount": number;
    december: number;
    "dec notes": string;
    "jan qty": number;
    "jan rate": number;
    "jan amount": number;
    january: number;
    "jan notes": string;
    "feb qty": number;
    "feb rate": number;
    "feb amount": number;
    february: number;
    "feb notes": string;
    "mar qty": number;
    "mar rate": number;
    "mar amount": number;
    march: number;
    "mar notes": string;
    [month: string]: number | string;
  }
  
  
  export interface FilterOptions {
    department: string; // Department ID as string
    departmentname: string; // Department name as string
    year: string; // Year as string
    subdepartmentId: number;
    subdepartmentName: string;
  }
  export interface BudgetFilterFormProps {
    filters: FilterOptions;
    handleSelect: (
      name: string,
      value: number | string | { id: number; departmentname: string },
    ) => void;
    budgetId: number | null;
    setBugetId: (val: number | null) => void;
    status: string | undefined;
    setStatus: (val: string) => void;
  }
  
  export interface ActivityBudgetProps {
    section: string;
    categoryId: number;
    budgetId: number;
    deptId: string;
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
    subdepartmentId: number;
    financialYear: string;
    onTotalsChange?: (totals: {
      totalQ1: number;
      totalQ2: number;
      totalQ3: number;
      totalQ4: number;
      totalFY: number;
    }) => void;
  }
  export interface totalschema {
    totalFY: number;
    totalQ1: number;
    totalQ2: number;
    totalQ3: number;
    totalQ4: number;
  }
  export interface subProgramActivitesSchema {
    map: number;
    name: string;
  }
 
  
  
  
  export type TableData = Record<string, LevelData>;
  
  
  export interface CapitalCostDataItem {
    id?: number;
    subcategoryId: number;
    total?: number;
    q1?: number;
    q2?: number;
    q3?: number;
    q4?: number;
    aprQty?: number;
    aprRate?: number;
    aprAmt?: number;
    aprNotes?: string;
    april?: string;
    mayQty?: number;
    mayRate?: number;
    mayAmt?: number;
    may?: string; 
    mayNotes?: string;
    junQty?: number;
    junRate?: number;
    junAmt?: number;
    junNotes?: string;
    june?: string;
    julQty?: number;
    julRate?: number;
    julAmt?: number;
    julNotes?: string;
    july?: string;
    augQty?: number;
    augRate?: number;
    augAmt?: number;
    augNotes?: string;
    august?: string;
    sepQty?: number;
    sepRate?: number;
    sepAmt?: number;
    sepNotes?: string;
    september?: string;
    octQty?: number;
    octRate?: number;
    octAmt?: number;
    octNotes?: string;
    october?: string;
    novQty?: number;
    novRate?: number;
    novAmt?: number;
    novNotes?: string;
    november?: string;
    decQty?: number;
    decRate?: number;
    decAmt?: number;
    decNotes?: string;
    december?: string;
    janQty?: number;
    janRate?: number;
    janAmt?: number;
    janNotes?: string;
    january?: string; 
    febQty?: number;
    febRate?: number;
    febAmt?: number;
    febNotes?: string;
    february?: string;      
    marQty?: number;
    marRate?: number;
    marAmt?: number;
    marNotes?: string;
    march?: string;
    [key: string]: number | string | undefined;
  }
  
  
  
  // For creating new budget details
  export interface BudgetDetailsCreate {
    budgetid: number;
    catid: number;
    subcategoryId: number;
    unit: number;
    rate: string;
    total: string;
    currency: string;
    notes?: string;
    description?: string;
    aprQty: number;
    aprRate: number;
    aprAmt: number;
     april: number;
    aprNotes: string;
    mayQty: number;
    mayRate: number;
    mayAmt: number;
    may: number;
    mayNotes: string;
    junQty: number;
    junRate: number;
    junAmt: number;
    june: number;
    junNotes: string;
    julQty: number;
    julRate: number;
    julAmt: number;
    july: number;
    julNotes: string;
    augQty: number;
    augRate: number;
    augAmt: number;
    august: number;
    augNotes: string;
      sepQty: number;
    sepRate: number;
    sepAmt: number;
    sepNotes: string;
    september : number;
    octQty: number;
    octRate: number;
    octAmt: number;
    october: number;
    novQty: number;
    novRate: number;
    novAmt: number;
    november: number;
    novNotes: string;
    decQty: number;
    decRate: number;
    decAmt: number;
    december: number;
    decNotes: string;
    janQty: number;
    janRate: number;
    janAmt: number;
    january: number;
    janNotes: string;
    febQty: number;
    febRate: number;
    febAmt: number;
    february: number;
    febNotes: string;
    marQty: number;
    marRate: number;
    marAmt: number;
    march: number;
    marNotes: string;
    deptId: number;
    subDeptId: number;
    createdBy: number;
    createdAt: string;
    activity: string;
  }
  
  export interface BudgetDetailsUpdate {  
    budgetDetailsId: number;
    budgetid: number;
    catid: number;
    subcategoryId: number;
    unit: number;
    rate: string;
    total: string;
    currency: string;
    notes?: string;
    description?: string;
    aprQty: number;
    aprRate: number;
    aprAmt: number;
     april: number;
    aprNotes: string;
    mayQty: number;
    mayRate: number;
    mayAmt: number;
    may: number;
    mayNotes: string;
    junQty: number;
    junRate: number;
    junAmt: number;
    june: number;
    junNotes: string;
    julQty: number;
    julRate: number;
    julAmt: number;
    july: number;
    julNotes: string;
    augQty: number;
    augRate: number;
    augAmt: number;
    august: number;
    augNotes: string;
      sepQty: number;
    sepRate: number;
    sepAmt: number;
    sepNotes: string;
    september : number;
    octQty: number;
    octRate: number;
    octAmt: number;
    october: number;
    octNotes: string;
    novQty: number;
    novRate: number;
    novAmt: number;
    november: number;
    novNotes: string;
    decQty: number;
    decRate: number;
    decAmt: number;
    december: number;
    decNotes: string;
    janQty: number;
    janRate: number;
    janAmt: number;
    january: number;
    janNotes: string;
    febQty: number;
    febRate: number;
    febAmt: number;
    february: number;
    febNotes: string;
    marQty: number;
    marRate: number;
    marAmt: number;
    march: number;
    marNotes: string;
    activity: string;
    deptId: number;
    subDeptId: number;
    updatedBy: number;
    updatedAt: string;
  }
  
  
  

  
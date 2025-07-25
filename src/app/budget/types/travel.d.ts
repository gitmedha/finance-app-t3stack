export interface LevelData {
  budgetDetailsId: number;
  // Count: string | number;
  "apr qty": number;
  "apr trips": number;
  "apr rate": number;
  "apr amount": number;
  april: number;
  "may qty": number;
  "may trips": number;
  "may rate": number;
  "may amount": number;
  may: number;
  "jun qty": number;
  "jun trips": number;
  "jun rate": number;
  "jun amount": number;
  june: number;
  "jul qty": number;
  "jul trips": number;
  "jul rate": number;
  "jul amount": number;
  july: number;
  "aug qty": number;
  "aug trips": number;
  "aug rate": number;
  "aug amount": number;
  august: number;
  "sep qty": number;
  "sep trips": number;
  "sep rate": number;
  "sep amount": number;
  september: number;
  "oct qty": number;
  "oct trips": number;
  "oct rate": number;
  "oct amount": number;
  october: number;
  "nov qty": number;
  "nov trips": number;
  "nov rate": number;
  "nov amount": number;
  november: number;
  "dec qty": number;
  "dec trips": number;
  "dec rate": number;
  "dec amount": number;
  december: number;
  "jan qty": number;
  "jan trips": number;
  "jan rate": number;
  "jan amount": number;
  january: number;
  "feb qty": number;
  "feb trips": number;
    "feb rate": number;
  "feb amount": number;
  february: number;
  "mar qty": number;
  "mar trips": number;
  "mar rate": number;
  "mar amount": number;
  march: number;
  [month: string]: number;
}
  export interface totalschema {
    totalFY:number
    totalQ1: number
    totalQ2: number
    totalQ3: number
    totalQ4: number
  }


  export interface TravelBudgetProps {
    section: string;
    categoryId: number;
    budgetId: number;
    deptId: string;
    searchSubCatId:number
    status: string | undefined
    sectionOpen: null | "PERSONNEL" | "Program Activities" | "Travel" | "PROGRAM OFFICE" | "CAPITAL COST" | "OVERHEADS"
    setSectionOpen: (val: null | "PERSONNEL" | "Program Activities" | "Travel" | "PROGRAM OFFICE" | "CAPITAL COST" | "OVERHEADS") => void
    subdepartmentId: number
    financialYear:string
  }


  export interface subTravelSchema {
    map: number
    id:number
    name: string
  }



// export type TableData = Record<string, ReturnType<typeof getBaseStructure>>;
export type TableData = Record<string, LevelData>;

interface TravelDataItem {
  id?: number;
  subcategoryId: number;
  total?: number;
  q1?: number;
  q2?: number;
  q3?: number;
  q4?: number;
  aprQty?: number;
  aprTrips?: number;
  aprRate?: number;
  aprAmt?: number;
  april?: string;
  mayQty?: number;
  mayTrips?: number;
  mayRate?: number;
  mayAmt?: number;
  may?: string;
  junQty?: number;
  junTrips?: number;
  junRate?: number;
  junAmt?: number;
  june?: string;
  julQty?: number;
  julTrips?: number;
  julRate?: number;
  julAmt?: number;
  july?: string;
  augQty?: number;
  augTrips?: number;
  augRate?: number;
  augAmt?: number;
  august?: string;
  sepQty?: number;
  sepTrips?: number;
  sepRate?: number;
  sepAmt?: number;
  september?: string;
  octQty?: number;
  octTrips?: number;
  octRate?: number;
  octAmt?: number;
  october?: string;
  novQty?: number;
  novTrips?: number;
  novRate?: number;
  novAmt?: number;
  november?: string;
  decQty?: number;
  decTrips?: number;
  decRate?: number;
  decAmt?: number;
  december?: string;
  janQty?: number;
  janTrips?: number;
  janRate?: number;
  janAmt?: number;
  january?: string; 
  febQty?: number;
  febTrips?: number;
    febRate?: number;
  febAmt?: number;
  february?: string;      
  marQty?: number;
  marTrips?: number;
  marRate?: number;
  marAmt?: number;
  march?: string;
  [key: string]: number | string | undefined;
}

export interface BudgetDetails {
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
  mayQty: number;
  mayRate: number;
  mayAmt: number;
  may: number;
  junQty: number;
  junRate: number;
  junAmt: number;
  june: number;
  julQty: number;
  julRate: number;
  julAmt: number;
  july: number;
  augQty: number;
  augRate: number;
  augAmt: number;
  august: number;
    sepQty: number;
  sepRate: number;
  sepAmt: number;
  september : number;
  octQty: number;
  octRate: number;
  octAmt: number;
  october: number;
  novQty: number;
  novRate: number;
  novAmt: number;
  november: number;
  decQty: number;
  decRate: number;
  decAmt: number;
  december: number;
  janQty: number;
  janRate: number;
  janAmt: number;
  january: number;
  febQty: number;
  febRate: number;
  febAmt: number;
    february: number;
  marQty: number;
  marRate: number;
  marAmt: number;
  march: number;
  activity?: string;
  deptId: number;
  subDeptId: number;
  createdBy: number;
  createdAt: string;
}



//create update budget details


export interface UpdateTravelBudgetDetails {
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
  mayQty: number;
  mayRate: number;
  mayAmt: number;
  may: number;
  junQty: number;
  junRate: number;
  junAmt: number;
  june: number;
  julQty: number;
  julRate: number;
  julAmt: number;
  july: number;
  augQty: number;
  augRate: number;
  augAmt: number;
  august: number;
  sepQty: number;
  sepRate: number;
  sepAmt: number;
  september: number;
  octQty: number;
  octRate: number;
  octAmt: number;
  october: number;
  novQty: number;
  novRate: number;
  novAmt: number;
  november: number;
  decQty: number;
  decRate: number;
  decAmt: number;
  december: number;
  janQty: number;
  janRate: number;
  janAmt: number;
  january: number;
  febQty: number;
  febRate: number;
  febAmt: number;
  february: number;
  marQty: number;
  marRate: number;
  marAmt: number;
  march: number;
  deptid: number;
  subdeptid: number;
  updatedBy: number;
  updatedAt: string;
  travel_typeid: number;
}

export interface TravelBudgetProps {
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


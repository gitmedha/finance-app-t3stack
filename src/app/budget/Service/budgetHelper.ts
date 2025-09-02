import { toast } from "react-toastify";
import type { BudgetDetailsCreate, BudgetDetailsUpdate, LevelData, ProgramDataItem, TableData, totalschema } from "../types/budget";
import { getBaseStructure, months } from "../Constants/budgetConstants";


export const handleBudgetSuccess = (
  // data: any,
  handelnputDisable: (val: boolean) => void,
  setSaveBtnState: (val: "edit" | "save" | "loading") => void,
) => {
  toast.success("Successfully Saved", {
    position: "bottom-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  handelnputDisable(true);
  setSaveBtnState("edit");

};

export const handleBudgetError = (error: unknown) => {
  console.error("Error during budget operation:", error);
  console.error("Error message:", (error as Error)?.message);
  console.error("Error data:", (error as { data?: unknown })?.data);
  console.error("Full error object:", JSON.stringify(error, null, 2));
  toast.warn("Error while saving", {
    position: "bottom-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};


export const handleCreateBudget = async ({
  payload,  
  createBudgetDetails,
  handelnputDisable,
  setSaveBtnState,
  onSuccess,
}: {
  payload: BudgetDetailsCreate[];
  createBudgetDetails: ReturnType<
    typeof import("~/trpc/react").api.post.addBudgetDetails.useMutation
  >;
  handelnputDisable: (disable: boolean) => void;
  setSaveBtnState: (state: "save" | "edit" | "loading") => void;
  onSuccess?: () => void;
}) => {
  try {
    const response = await createBudgetDetails.mutateAsync({
      data: payload
    });
    handleBudgetSuccess(handelnputDisable, setSaveBtnState);
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    handleBudgetError(error);
    setSaveBtnState("save");
  }
};

export const handleUpdateBudget = async ({
  payload,
  updateBudgetDetails,
  handelnputDisable,
  setSaveBtnState,
  onSuccess,
}: {
  payload: BudgetDetailsUpdate[];
  updateBudgetDetails: ReturnType<
    typeof import("~/trpc/react").api.post.updateBudgetDetails.useMutation
  >;
  handelnputDisable: (disable: boolean) => void;
  setSaveBtnState: (state: "save" | "edit" | "loading") => void;
  onSuccess?: () => void;
}) => {
  try {
    const response = await updateBudgetDetails.mutateAsync({
      data: payload
    });
    handleBudgetSuccess(handelnputDisable, setSaveBtnState);
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    handleBudgetError(error);
    setSaveBtnState("edit");
  }
};

export const mapItemToBaseStructure =(item: ProgramDataItem): LevelData => {

  return {
  budgetDetailsId: Number(item.id),
  // Count: item.Count,
  "apr qty": Number(item.aprQty),
  "apr rate": Number(item.aprRate),
  "apr amount": Number(item.aprAmt),
  "apr notes": item.aprNotes ?? "",
  april: Number(item.april),
  "may qty": Number(item.mayQty),
  "may rate": Number(item.mayRate),
  "may amount": Number(item.mayAmt),
  may: Number(item.may),
  "may notes": item.mayNotes ?? "",
  "jun qty": Number(item.junQty),
  "jun rate": Number(item.junRate),
  "jun amount": Number(item.junAmt),
  june: Number(item.june),
  "jun notes": item.junNotes ?? "",
  "jul qty": Number(item.julQty),
  "jul rate": Number(item.julRate),
  "jul amount": Number(item.julAmt),
  july: Number(item.july),
  "jul notes": item.julNotes ?? "",
  "aug qty": Number(item.augQty),
  "aug rate": Number(item.augRate),
  "aug amount": Number(item.augAmt),
  august: Number(item.august),
  "aug notes": item.augNotes ?? "",
  "sep qty": Number(item.sepQty),
  "sep rate": Number(item.sepRate),
  "sep amount": Number(item.sepAmt),
  september: Number(item.september),
  "sep notes": item.sepNotes ?? "",
  "oct qty": Number(item.octQty),
  "oct rate": Number(item.octRate),
  "oct amount": Number(item.octAmt),
  october: Number(item.october),
  "oct notes": item.octNotes ?? "",
  "nov qty": Number(item.novQty),
  "nov rate": Number(item.novRate),
  "nov amount": Number(item.novAmt),
  november: Number(item.november),
  "nov notes": item.novNotes ?? "",
  "dec qty": Number(item.decQty),
  "dec rate": Number(item.decRate),
  "dec amount": Number(item.decAmt),
  december: Number(item.december),
  "dec notes": item.decNotes ?? "",
  "jan qty": Number(item.janQty),
  "jan rate": Number(item.janRate),
  "jan amount": Number(item.janAmt),
  january: Number(item.january),
  "jan notes": item.janNotes ?? "",
  "feb qty": Number(item.febQty),
  "feb rate": Number(item.febRate),
  "feb amount": Number(item.febAmt),
  february: Number(item.february),
  "feb notes": item.febNotes ?? "",
  "mar qty": Number(item.marQty),
  "mar rate": Number(item.marRate),
  "mar amount": Number(item.marAmt),
  march: Number(item.march),
  "mar notes": item.marNotes ?? "",
  };
};

export const transformTableRowToBudgetDetail = (
  subCategoryId: string,
  data: ReturnType<typeof getBaseStructure>,
  budgetId: number,
  categoryId: number,
  deptId: string,
  subdepartmentId: number,
  userId: number,
  filter: number,
) => ({
  budgetid: budgetId,
  catid: categoryId,
  subcategoryId: parseInt(subCategoryId, 10),
  unit: 1,
  rate: "1",
  total: "1",
  currency: "INR",
  notes: undefined,
  description: undefined,
  aprRate: data["apr rate"],
  aprAmt: data["apr amount"],
  aprQty: data["apr qty"],
  april: data.april,
  aprNotes: data["apr notes"],
  mayRate: data["may rate"],
  mayAmt: data["may amount"],
  mayQty: data["may qty"],
  may: data.may,
  mayNotes: data["may notes"],
  junRate: data["jun rate"],
  junAmt: data["jun amount"],
  junQty: data["jun qty"],
  june: data.june,
  junNotes: data["jun notes"],
  julRate: data["jul rate"],
  julAmt: data["jul amount"],
  julQty: data["jul qty"],
  july: data.july,
  julNotes: data["jul notes"],
  augRate: data["aug rate"],
  augAmt: data["aug amount"],
  augQty: data["aug qty"],
  august: data.august,
  augNotes: data["aug notes"],
  sepRate: data["sep rate"],
  sepAmt: data["sep amount"],
  sepQty: data["sep qty"],
  september: data.september,
  sepNotes: data["sep notes"],
  octRate: data["oct rate"],
  octAmt: data["oct amount"],
  octQty: data["oct qty"],
  october: data.october,
  novRate: data["nov rate"],
  novAmt: data["nov amount"],
  novQty: data["nov qty"],
  november: data.november,
  novNotes: data["nov notes"],
  decRate: data["dec rate"],
  decAmt: data["dec amount"],
  decQty: data["dec qty"],
  december: data.december,
  decNotes: data["dec notes"],
  janRate: data["jan rate"],
  janAmt: data["jan amount"],
  janQty: data["jan qty"],
  january: data.january,
  janNotes: data["jan notes"],
  febRate: data["feb rate"],
  febAmt: data["feb amount"],
  febQty: data["feb qty"],
  february: data.february,
  febNotes: data["feb notes"],
  marRate: data["mar rate"],
  marAmt: data["mar amount"],
  marQty: data["mar qty"],
  march: data.march,
  marNotes: data["mar notes"],
  deptId: Number(deptId),
  subDeptId: Number(subdepartmentId),
  createdBy: userId,
  createdAt: new Date().toISOString(),
  activity: filter.toString() ?? "0",
});

export const transformTableRowToUpdateBudgetDetail = (
  subCategoryId: string,
  data: LevelData,  // or use `any` temporarily if getBaseStructure isn't accessible
  budgetId: number,
  categoryId: number,
  deptId: string | number,
  userId: number,
  subdepartmentId: number,
  filter: number,
) => ({
  budgetDetailsId: data?.budgetDetailsId ?? 0,
  budgetid: budgetId,
  catid: categoryId,
  subcategoryId: parseInt(subCategoryId, 10),
  unit: 1,
  rate: "1",
  total: "1",
  currency: "INR",
  notes: undefined,
  description: undefined,
  aprQty: Number(data["apr qty"]),
  aprRate: Number(data["apr rate"]),
  aprAmt: Number(data["apr amount"]),
  april: Number(data.april),
  aprNotes: data["apr notes"],
  mayQty: Number(data["may qty"]),
  mayRate: Number(data["may rate"]),
  mayAmt: Number(data["may amount"]),
  may: Number(data.may),
  mayNotes: data["may notes"],
  junQty: Number(data["jun qty"]),
  junRate: Number(data["jun rate"]),
  junAmt: Number(data["jun amount"]),
  june: Number(data.june),
  junNotes: data["jun notes"],
  julQty: Number(data["jul qty"]),
  julRate: Number(data["jul rate"]),
  julAmt: Number(data["jul amount"]),
  july: Number(data.july),
  julNotes: data["jul notes"],
  augQty: Number(data["aug qty"]),
  augRate: Number(data["aug rate"]),
  augAmt: Number(data["aug amount"]),
  august: Number(data.august),
  augNotes: data["aug notes"],
  sepQty: Number(data["sep qty"]),
  sepRate: Number(data["sep rate"]),
  sepAmt: Number(data["sep amount"]),
  september: Number(data.september),
  sepNotes: data["sep notes"],
  octQty: Number(data["oct qty"]),
  octRate: Number(data["oct rate"]),
  octAmt: Number(data["oct amount"]),
  october: Number(data.october),
  octNotes: data["oct notes"],
  novQty: Number(data["nov qty"]),
  novRate: Number(data["nov rate"]),
  novAmt: Number(data["nov amount"]),
  november: Number(data.november),
  novNotes: data["nov notes"],
  decQty: Number(data["dec qty"]),
  decRate: Number(data["dec rate"]),
  decAmt: Number(data["dec amount"]),
  december: Number(data.december),
  decNotes: data["dec notes"],
  janQty: Number(data["jan qty"]),
  janRate: Number(data["jan rate"]),
  janAmt: Number(data["jan amount"]),
  january: Number(data.january),
  janNotes: data["jan notes"],
  febQty: Number(data["feb qty"]),
  febRate: Number(data["feb rate"]),
  febAmt: Number(data["feb amount"]),
  february: Number(data.february),
  febNotes: data["feb notes"],
  marQty: Number(data["mar qty"]),
  marRate: Number(data["mar rate"]),
  marAmt: Number(data["mar amount"]),
  march: Number(data.march),
  marNotes: data["mar notes"],
  deptId: Number(deptId),
  subDeptId: subdepartmentId,
  activity: filter.toString() ?? "0",
  updatedBy: userId,
  updatedAt: new Date().toISOString(),
});

export const recalculateTotals = (tableData: TableData, setTotalQty: (totals: totalschema) => void) => {
  const newTotals: totalschema = {
    totalQ1: 0,
    totalQ2: 0,
    totalQ3: 0,
    totalQ4: 0,
    totalFY: 0,
  };

  Object.values(tableData).forEach((data) => {
    if (!data) return;
    
    // Q1: April, May, June (first quarter of fiscal year)
    newTotals.totalQ1 += 
      Number(data.april ?? 0) + 
      Number(data.may ?? 0) + 
      Number(data.june ?? 0);
    
    // Q2: July, August, September
    newTotals.totalQ2 += 
      Number(data.july ?? 0) + 
      Number(data.august ?? 0) + 
      Number(data.september ?? 0);
    
    // Q3: October, November, December
    newTotals.totalQ3 += 
      Number(data.october ?? 0) + 
      Number(data.november ?? 0) + 
      Number(data.december ?? 0);
    
    // Q4: January, February, March
    newTotals.totalQ4 += 
      Number(data.january ?? 0) + 
      Number(data.february ?? 0) + 
      Number(data.march ?? 0);
  });
  
  // Set the total for fiscal year
  newTotals.totalFY = 
    newTotals.totalQ1 + 
    newTotals.totalQ2 + 
    newTotals.totalQ3 + 
    newTotals.totalQ4;
  
  setTotalQty(newTotals);
};

export const computeSimpleTotals = (tableData: TableData): Partial<LevelData> => {
  const totals: Partial<LevelData> = {};
  const qtySums: Record<string, number> = {};
  const amtSums: Record<string, number> = {};

  months.forEach((m) => {
    if (m.endsWith(" notes")) {
      // totals[m] = "";
      return;
    }

    let sum = 0;
    Object.values(tableData).forEach((row) => {
      const val = Number(row?.[m as keyof LevelData] ?? 0);
      if (!isNaN(val)) sum += val;
    });

    // remember per-month qty & amount to compute rate later
    if (m.endsWith(" qty")) qtySums[m.split(" ")[0] ?? ""] = sum;
    if (m.endsWith(" amount")) amtSums[m.split(" ")[0] ?? ""] = sum;

    totals[m] = sum;
  });

  // finalize rates: avg = amount / qty (0 if qty=0)
  months.forEach((m) => {
    if (m.endsWith(" rate")) {
      const base = m.split(" ")[0];
      const qty = qtySums[base ?? ""] ?? 0;
      const amt = amtSums[base ?? ""] ?? 0;
      totals[m] = qty > 0 ? Number((amt / qty).toFixed(2)) : 0;
    }
  });

  return totals;
}

export const calculateQuarterlyValues = (row: LevelData) => {
  const quarterlyData: Record<string, number> = {};
  
  // Q1: Apr + May + Jun
  const q1Qty = Number(row["apr qty"] ?? 0) + Number(row["may qty"] ?? 0) + Number(row["jun qty"] ?? 0);
  const q1Amount = Number(row["apr amount"] ?? 0) + Number(row["may amount"] ?? 0) + Number(row["jun amount"] ?? 0);
  const q1Rate = q1Qty > 0 ? Number((q1Amount / q1Qty).toFixed(2)) : 0;
  
  // Q2: Jul + Aug + Sep
  const q2Qty = Number(row["jul qty"] ?? 0) + Number(row["aug qty"] ?? 0) + Number(row["sep qty"] ?? 0);
  const q2Amount = Number(row["jul amount"] ?? 0) + Number(row["aug amount"] ?? 0) + Number(row["sep amount"] ?? 0);
  const q2Rate = q2Qty > 0 ? Number((q2Amount / q2Qty).toFixed(2)) : 0;
  
  // Q3: Oct + Nov + Dec
  const q3Qty = Number(row["oct qty"] ?? 0) + Number(row["nov qty"] ?? 0) + Number(row["dec qty"] ?? 0);
  const q3Amount = Number(row["oct amount"] ?? 0) + Number(row["nov amount"] ?? 0) + Number(row["dec amount"] ?? 0);
  const q3Rate = q3Qty > 0 ? Number((q3Amount / q3Qty).toFixed(2)) : 0;
  
  // Q4: Jan + Feb + Mar
  const q4Qty = Number(row["jan qty"] ?? 0) + Number(row["feb qty"] ?? 0) + Number(row["mar qty"] ?? 0);
  const q4Amount = Number(row["jan amount"] ?? 0) + Number(row["feb amount"] ?? 0) + Number(row["mar amount"] ?? 0);
  const q4Rate = q4Qty > 0 ? Number((q4Amount / q4Qty).toFixed(2)) : 0;
  
  return {
    "Q1 qty": q1Qty,
    "Q1 rate": q1Rate,
    "Q1 amount": q1Amount,
    "Q2 qty": q2Qty,
    "Q2 rate": q2Rate,
    "Q2 amount": q2Amount,
    "Q3 qty": q3Qty,
    "Q3 rate": q3Rate,
    "Q3 amount": q3Amount,
    "Q4 qty": q4Qty,
    "Q4 rate": q4Rate,
    "Q4 amount": q4Amount,
  };
};

export const calculateQuarterlyTotalsFromColumnTotals = (columnTotals: Partial<LevelData>) => {
  const quarterlyTotals: Record<string, number> = {};
  
  // Q1: Apr + May + Jun
  quarterlyTotals["Q1 qty"] = Number(columnTotals["apr qty"] ?? 0) + Number(columnTotals["may qty"] ?? 0) + Number(columnTotals["jun qty"] ?? 0);
  quarterlyTotals["Q1 amount"] = Number(columnTotals["apr amount"] ?? 0) + Number(columnTotals["may amount"] ?? 0) + Number(columnTotals["jun amount"] ?? 0);
  quarterlyTotals["Q1 rate"] = quarterlyTotals["Q1 qty"] > 0 ? Number((quarterlyTotals["Q1 amount"] / quarterlyTotals["Q1 qty"]).toFixed(2)) : 0;
  
  // Q2: Jul + Aug + Sep
  quarterlyTotals["Q2 qty"] = Number(columnTotals["jul qty"] ?? 0) + Number(columnTotals["aug qty"] ?? 0) + Number(columnTotals["sep qty"] ?? 0);
  quarterlyTotals["Q2 amount"] = Number(columnTotals["jul amount"] ?? 0) + Number(columnTotals["aug amount"] ?? 0) + Number(columnTotals["sep amount"] ?? 0);
  quarterlyTotals["Q2 rate"] = quarterlyTotals["Q2 qty"] > 0 ? Number((quarterlyTotals["Q2 amount"] / quarterlyTotals["Q2 qty"]).toFixed(2)) : 0;
  
  // Q3: Oct + Nov + Dec
  quarterlyTotals["Q3 qty"] = Number(columnTotals["oct qty"] ?? 0) + Number(columnTotals["nov qty"] ?? 0) + Number(columnTotals["dec qty"] ?? 0);
  quarterlyTotals["Q3 amount"] = Number(columnTotals["oct amount"] ?? 0) + Number(columnTotals["nov amount"] ?? 0) + Number(columnTotals["dec amount"] ?? 0);
  quarterlyTotals["Q3 rate"] = quarterlyTotals["Q3 qty"] > 0 ? Number((quarterlyTotals["Q3 amount"] / quarterlyTotals["Q3 qty"]).toFixed(2)) : 0;
  
  // Q4: Jan + Feb + Mar
  quarterlyTotals["Q4 qty"] = Number(columnTotals["jan qty"] ?? 0) + Number(columnTotals["feb qty"] ?? 0) + Number(columnTotals["mar qty"] ?? 0);
  quarterlyTotals["Q4 amount"] = Number(columnTotals["jan amount"] ?? 0) + Number(columnTotals["feb amount"] ?? 0) + Number(columnTotals["mar amount"] ?? 0);
  quarterlyTotals["Q4 rate"] = quarterlyTotals["Q4 qty"] > 0 ? Number((quarterlyTotals["Q4 amount"] / quarterlyTotals["Q4 qty"]).toFixed(2)) : 0;
  
  return quarterlyTotals;
};
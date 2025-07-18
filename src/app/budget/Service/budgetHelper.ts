import { toast } from "react-toastify";
import type { BudgetDetailsCreate, BudgetDetailsUpdate, LevelData, ProgramDataItem } from "../types/budget";
import { getBaseStructure } from "../Constants/budgetConstants";


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
}: {
  payload: BudgetDetailsCreate[];
  createBudgetDetails: ReturnType<
    typeof import("~/trpc/react").api.post.addBudgetDetails.useMutation
  >;
  handelnputDisable: (disable: boolean) => void;
  setSaveBtnState: (state: "save" | "edit" | "loading") => void;
}) => {
  try {
    const response = await createBudgetDetails.mutateAsync({
      data: payload
    });
    handleBudgetSuccess(handelnputDisable, setSaveBtnState);
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
}: {
  payload: BudgetDetailsUpdate[];
  updateBudgetDetails: ReturnType<
    typeof import("~/trpc/react").api.post.updateBudgetDetails.useMutation
  >;
  handelnputDisable: (disable: boolean) => void;
  setSaveBtnState: (state: "save" | "edit" | "loading") => void;
}) => {
  try {
    const response = await updateBudgetDetails.mutateAsync({
      data: payload
    });
    handleBudgetSuccess(handelnputDisable, setSaveBtnState);
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
  april: Number(item.april),
  "may qty": Number(item.mayQty),
  "may rate": Number(item.mayRate),
  "may amount": Number(item.mayAmt),
  may: Number(item.may),
  "jun qty": Number(item.junQty),
  "jun rate": Number(item.junRate),
  "jun amount": Number(item.junAmt),
  june: Number(item.june),
  "jul qty": Number(item.julQty),
  "jul rate": Number(item.julRate),
  "jul amount": Number(item.julAmt),
  july: Number(item.july),
  "aug qty": Number(item.augQty),
  "aug rate": Number(item.augRate),
  "aug amount": Number(item.augAmt),
  august: Number(item.august),
  "sep qty": Number(item.sepQty),
  "sep rate": Number(item.sepRate),
  "sep amount": Number(item.sepAmt),
  september: Number(item.september),
  "oct qty": Number(item.octQty),
  "oct rate": Number(item.octRate),
  "oct amount": Number(item.octAmt),
  october: Number(item.october),
  "nov qty": Number(item.novQty),
  "nov rate": Number(item.novRate),
  "nov amount": Number(item.novAmt),
  november: Number(item.november),
  "dec qty": Number(item.decQty),
  "dec rate": Number(item.decRate),
  "dec amount": Number(item.decAmt),
  december: Number(item.december),
  "jan qty": Number(item.janQty),
  "jan rate": Number(item.janRate),
  "jan amount": Number(item.janAmt),
  january: Number(item.january),
  "feb qty": Number(item.febQty),
  "feb rate": Number(item.febRate),
  "feb amount": Number(item.febAmt),
  february: Number(item.february),
  "mar qty": Number(item.marQty),
  "mar rate": Number(item.marRate),
  "mar amount": Number(item.marAmt),
  march: Number(item.march),
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
  mayRate: data["may rate"],
  mayAmt: data["may amount"],
  mayQty: data["may qty"],
  may: data.may,
  junRate: data["jun rate"],
  junAmt: data["jun amount"],
  junQty: data["jun qty"],
  june: data.june,
  julRate: data["jul rate"],
  julAmt: data["jul amount"],
  julQty: data["jul qty"],
  july: data.july,
  augRate: data["aug rate"],
  augAmt: data["aug amount"],
  augQty: data["aug qty"],
  august: data.august,
  sepRate: data["sep rate"],
  sepAmt: data["sep amount"],
  sepQty: data["sep qty"],
  september: data.september,
  octRate: data["oct rate"],
  octAmt: data["oct amount"],
  octQty: data["oct qty"],
  october: data.october,
  novRate: data["nov rate"],
  novAmt: data["nov amount"],
  novQty: data["nov qty"],
  november: data.november,
  decRate: data["dec rate"],
  decAmt: data["dec amount"],
  decQty: data["dec qty"],
  december: data.december,
  janRate: data["jan rate"],
  janAmt: data["jan amount"],
  janQty: data["jan qty"],
  january: data.january,
  febRate: data["feb rate"],
  febAmt: data["feb amount"],
  febQty: data["feb qty"],
  february: data.february,
  marRate: data["mar rate"],
  marAmt: data["mar amount"],
  marQty: data["mar qty"],
  march: data.march,
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
  mayQty: Number(data["may qty"]),
  mayRate: Number(data["may rate"]),
  mayAmt: Number(data["may amount"]),
  may: Number(data.may),
  junQty: Number(data["jun qty"]),
  junRate: Number(data["jun rate"]),
  junAmt: Number(data["jun amount"]),
  june: Number(data.june),
  julQty: Number(data["jul qty"]),
  julRate: Number(data["jul rate"]),
  julAmt: Number(data["jul amount"]),
  july: Number(data.july),
  augQty: Number(data["aug qty"]),
  augRate: Number(data["aug rate"]),
  augAmt: Number(data["aug amount"]),
  august: Number(data.august),
  sepQty: Number(data["sep qty"]),
  sepRate: Number(data["sep rate"]),
  sepAmt: Number(data["sep amount"]),
  september: Number(data.september),
  octQty: Number(data["oct qty"]),
  octRate: Number(data["oct rate"]),
  octAmt: Number(data["oct amount"]),
  october: Number(data.october),
  novQty: Number(data["nov qty"]),
  novRate: Number(data["nov rate"]),
  novAmt: Number(data["nov amount"]),
  november: Number(data.november),
  decQty: Number(data["dec qty"]),
  decRate: Number(data["dec rate"]),
  decAmt: Number(data["dec amount"]),
  december: Number(data.december),
  janQty: Number(data["jan qty"]),
  janRate: Number(data["jan rate"]),
  janAmt: Number(data["jan amount"]),
  january: Number(data.january),
  febQty: Number(data["feb qty"]),
  febRate: Number(data["feb rate"]),
  febAmt: Number(data["feb amount"]),
  february: Number(data.february),
  marQty: Number(data["mar qty"]),
  marRate: Number(data["mar rate"]),
  marAmt: Number(data["mar amount"]),
  march: Number(data.march),
  deptId: Number(deptId),
  subDeptId: subdepartmentId,
  activity: filter.toString() ?? "0",
  updatedBy: userId,
  updatedAt: new Date().toISOString(),
});
import { getBaseStructure } from "../Constants/travelConstants";
import { LevelData, TableData, totalschema, TravelDataItem } from "../types/travel";
import { toast, Bounce } from "react-toastify";

export const transformTableRowToBudgetDetail = (
  subCategoryId: string,
  data: ReturnType<typeof getBaseStructure>,
  budgetId: number,
  categoryId: number,
  deptId: string,
  subdepartmentId: number,
  userId: number,
  travel_typeid: number,
) => ({
  budgetid: budgetId,
  catid: categoryId,
  subcategoryId: parseInt(subCategoryId, 10),
  travel_typeid: travel_typeid,
  unit: 1,
  rate: "1",
  total: "1",
  currency: "INR",
  notes: undefined,
  description: undefined,
  aprRate: data["apr rate"],
  aprAmt: data["apr amount"],
  aprQty: data["apr qty"],
  aprTrips: data["apr trips"],
  april: data.april,
  mayRate: data["may rate"],
  mayAmt: data["may amount"],
  mayQty: data["may qty"],
  mayTrips: data["may trips"],
  may: data.may,
  junRate: data["jun rate"],
  junAmt: data["jun amount"],
  junQty: data["jun qty"],
  junTrips: data["jun trips"],
  june: data.june,
  julRate: data["jul rate"],
  julAmt: data["jul amount"],
  julQty: data["jul qty"],
  julTrips: data["jul trips"],
  july: data.july,
  augRate: data["aug rate"],
  augAmt: data["aug amount"],
  augQty: data["aug qty"],
  augTrips: data["aug trips"],
  august: data.august,
  sepRate: data["sep rate"],
  sepAmt: data["sep amount"],
  sepQty: data["sep qty"],
  sepTrips: data["sep trips"],
  september: data.september,
  octRate: data["oct rate"],
  octAmt: data["oct amount"],
  octQty: data["oct qty"],
  octTrips: data["oct trips"],
  october: data.october,
  novRate: data["nov rate"],
  novAmt: data["nov amount"],
  novQty: data["nov qty"],
  novTrips: data["nov trips"],
  november: data.november,
  decRate: data["dec rate"],
  decAmt: data["dec amount"],
  decQty: data["dec qty"],
  decTrips: data["dec trips"],
  december: data.december,
  janRate: data["jan rate"],
  janAmt: data["jan amount"],
  janQty: data["jan qty"],
  janTrips: data["jan trips"],
  january: data.january,
  febRate: data["feb rate"],
  febAmt: data["feb amount"],
  febQty: data["feb qty"],
  febTrips: data["feb trips"],
  february: data.february,
  marRate: data["mar rate"],
  marAmt: data["mar amount"],
  marQty: data["mar qty"],
  marTrips: data["mar trips"],
  march: data.march,
  deptId: Number(deptId),
  subDeptId: subdepartmentId,
  createdBy: userId,
  createdAt: new Date().toISOString(),
});

export const handleSaveSuccess = (
  response: {
    data: {
      subcategoryId: number;
      budgetDetailsId: number;
    }[];
  },
  setTableData: React.Dispatch<React.SetStateAction<TableData>>,
  handelnputDisable: (disable: boolean) => void,
  setSaveBtnState: (state: "loading" | "edit" | "save") => void,
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

  setSaveBtnState("edit");
  handelnputDisable(true);

  setTableData((prev) => {
    const updatedData = { ...prev };
    response.data.forEach((item) => {
      const subCategoryData = updatedData[item.subcategoryId];
      if (subCategoryData) {
        updatedData[item.subcategoryId] = {
          ...subCategoryData,
          budgetDetailsId: item.budgetDetailsId,
        };
      }
    });
    return updatedData;
  });

  console.log("Budget created successfully:", response);
};

export const handleSaveError = (
  error: unknown,
  setSaveBtnState: (state: "loading" | "edit" | "save") => void,
) => {
  console.error("Error creating budget:", error);
  setSaveBtnState("save");

  toast.warn("Error while saving", {
    position: "bottom-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });
};

export const handleUpdateSuccess = (
  response: unknown, // or your API return type
  handelnputDisable: (disable: boolean) => void,
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
  console.log("Budget updated successfully:", response);
};

export const handleUpdateError = (
  error: unknown,
  setSaveBtnState: (state: "loading" | "edit" | "save") => void,
) => {
  console.error("Error updating budget:", error);
  setSaveBtnState("edit");

  toast.warn("Error While saving", {
    position: "bottom-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });
};

export const transformTableRowToUpdateBudgetDetail = (
  subCategoryId: string,
  data: ReturnType<typeof getBaseStructure>, // or use `any` temporarily if getBaseStructure isn't accessible
  budgetId: number,
  categoryId: number,
  deptId: string | number,
  userId: number,
  subdepartmentId: number,
  travel_typeid: number,
) => ({
  budgetDetailsId: data.budgetDetailsId,
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
  aprTrips: Number(data["apr trips"]),
  april: Number(data.april),
  mayQty: Number(data["may qty"]),
  mayRate: Number(data["may rate"]),
  mayAmt: Number(data["may amount"]),
  mayTrips: Number(data["may trips"]),
  may: Number(data.may),
  junQty: Number(data["jun qty"]),
  junRate: Number(data["jun rate"]),
  junAmt: Number(data["jun amount"]),
  junTrips: Number(data["jun trips"]),
  june: Number(data.june),
  julQty: Number(data["jul qty"]),
  julRate: Number(data["jul rate"]),
  julAmt: Number(data["jul amount"]),
  julTrips: Number(data["jul trips"]),
  july: Number(data.july),
  augQty: Number(data["aug qty"]),
  augRate: Number(data["aug rate"]),
  augAmt: Number(data["aug amount"]),
  augTrips: Number(data["aug trips"]),
  august: Number(data.august),
  sepQty: Number(data["sep qty"]),
  sepRate: Number(data["sep rate"]),
  sepAmt: Number(data["sep amount"]),
  sepTrips: Number(data["sep trips"]),
  september: Number(data.september),
  octQty: Number(data["oct qty"]),
  octRate: Number(data["oct rate"]),
  octAmt: Number(data["oct amount"]),
  octTrips: Number(data["oct trips"]),
  october: Number(data.october),
  novQty: Number(data["nov qty"]),
  novRate: Number(data["nov rate"]),
  novAmt: Number(data["nov amount"]),
  novTrips: Number(data["nov trips"]),
  november: Number(data.november),
  decQty: Number(data["dec qty"]),
  decRate: Number(data["dec rate"]),
  decAmt: Number(data["dec amount"]),
  decTrips: Number(data["dec trips"]),
  december: Number(data.december),
  janQty: Number(data["jan qty"]),
  janRate: Number(data["jan rate"]),
  janAmt: Number(data["jan amount"]),
  janTrips: Number(data["jan trips"]),
  january: Number(data.january),
  febQty: Number(data["feb qty"]),
  febRate: Number(data["feb rate"]),
  febAmt: Number(data["feb amount"]),
  febTrips: Number(data["feb trips"]),
  february: Number(data.february),
  marQty: Number(data["mar qty"]),
  marRate: Number(data["mar rate"]),
  marAmt: Number(data["mar amount"]),
  marTrips: Number(data["mar trips"]),
  march: Number(data.march),
  deptid: Number(deptId),
  subdeptid: subdepartmentId,
  travel_typeid: travel_typeid,
  updatedBy: userId,
  updatedAt: new Date().toISOString(),
});

export const mapItemToBaseStructure = (item: TravelDataItem): LevelData => ({
  "apr qty": Number(item.aprQty),
  "apr trips": Number(item.aprTrips),
  "apr rate": Number(item.aprRate),
  "apr amount": Number(item.aprAmt),
  april: Number(item.april),
  "may qty": Number(item.mayQty),
  "may trips": Number(item.mayTrips),
  "may rate": Number(item.mayRate),
  "may amount": Number(item.mayAmt),
  may: Number(item.may),
  "jun qty": Number(item.junQty),
  "jun trips": Number(item.junTrips),
  "jun rate": Number(item.junRate),
  "jun amount": Number(item.junAmt),
  june: Number(item.june),
  "jul qty": Number(item.julQty),
  "jul trips": Number(item.julTrips),
  "jul rate": Number(item.julRate),
  "jul amount": Number(item.julAmt),
  july: Number(item.july),
  "aug qty": Number(item.augQty),
  "aug trips": Number(item.augTrips),
  "aug rate": Number(item.augRate),
  "aug amount": Number(item.augAmt),
  august: Number(item.august),
  "sep qty": Number(item.sepQty),
  "sep trips": Number(item.sepTrips),
  "sep rate": Number(item.sepRate),
  "sep amount": Number(item.sepAmt),
  september: Number(item.september),
  "oct qty": Number(item.octQty),
  "oct trips": Number(item.octTrips),
  "oct rate": Number(item.octRate),
  "oct amount": Number(item.octAmt),
  october: Number(item.october),
  "nov qty": Number(item.novQty),
  "nov trips": Number(item.novTrips),
  "nov rate": Number(item.novRate),
  "nov amount": Number(item.novAmt),
  november: Number(item.november),
  "dec qty": Number(item.decQty),
  "dec trips": Number(item.decTrips),
  "dec rate": Number(item.decRate),
  "dec amount": Number(item.decAmt),
  december: Number(item.december),
  "jan qty": Number(item.janQty),
  "jan trips": Number(item.janTrips),
  "jan rate": Number(item.janRate),
  "jan amount": Number(item.janAmt),
  january: Number(item.january),
  "feb qty": Number(item.febQty),
  "feb trips": Number(item.febTrips),
    "feb rate": Number(item.febRate),
  "feb amount": Number(item.febAmt),
  february: Number(item.february),
  "mar qty": Number(item.marQty),
  "mar trips": Number(item.marTrips),
  "mar rate": Number(item.marRate),
  "mar amount": Number(item.marAmt),
  march: Number(item.march),
  budgetDetailsId: Number(item.id),
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
    newTotals.totalQ1 += Number(data.april || 0) + Number(data.may || 0) + Number(data.june || 0);
    newTotals.totalQ2 += Number(data.july || 0) + Number(data.august || 0) + Number(data.september || 0);
    newTotals.totalQ3 += Number(data.october || 0) + Number(data.november || 0) + Number(data.december || 0);
    newTotals.totalQ4 += Number(data.january || 0) + Number(data.february || 0) + Number(data.march || 0);
  });
  
  newTotals.totalFY = newTotals.totalQ1 + newTotals.totalQ2 + newTotals.totalQ3 + newTotals.totalQ4;
  setTotalQty(newTotals);
};
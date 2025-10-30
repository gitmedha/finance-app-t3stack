import { TableData, totalschema, avgQtySchema } from "../types/personnelCost";

type SubCategory = { subCategoryId: number };

export function buildInitialState(subCategories: SubCategory[]) {
  const initialData: TableData = {};
  const initialAvgQty: avgQtySchema = {};
//   console.log(subCategories, "subCategories");
  subCategories.forEach((sub) => {
    initialData[sub.subCategoryId] = {
      Count: "0",
      Qty1: 0,
      Apr: "0",
      May: "0",
      Jun: "0",
      Q1: "0",
      Qty2: 0,
      Jul: "0",
      Aug: "0",
      Sep: "0",
      Q2: "0",
      Qty3: 0,
      Oct: "0",
      Nov: "0",
      Dec: "0",
      Q3: "0",
      Qty4: 0,
      Jan: "0",
      Feb: "0",
      Mar: "0",
      Q4: "0",
      Total: "0",
      budgetDetailsId: 0,
    };
    initialAvgQty[sub.subCategoryId] = {
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
      Jan: 0,
      Feb: 0,
      Mar: 0,
    };
  });
 
  return { initialData, initialAvgQty };
}

export function applyBudgetResults(
  initialData: TableData,
  initialAvgQty: avgQtySchema,
  result: any[]
) {
  const tableData: TableData = { ...initialData };
  const avgQty: avgQtySchema = { ...initialAvgQty };
  const totals: totalschema = { totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0, totalFY: 0 };

  result.forEach((item) => {
    tableData[item.subcategoryId] = {
      Count: Number(item.total),
      Apr: item.april ? Number(item.april) : "0",
      May: item.may ? Number(item.may) : "0",
      Jun: item.june ? Number(item.june) : "0",
      Q1: (
        Number(item.april || "0") +
        Number(item.may || "0") +
        Number(item.june || "0")
      ).toString(),
      Jul: item.july ? Number(item.july) : "0",
      Aug: item.august ? Number(item.august) : "0",
      Sep: item.september ? Number(item.september) : "0",
      Q2: (
        Number(item.july || "0") +
        Number(item.august || "0") +
        Number(item.september || "0")
      ).toString(),
      Oct: item.october ? Number(item.october) : "0",
      Nov: item.november ? Number(item.november) : "0",
      Dec: item.december ? Number(item.december) : "0",
      Q3: (
        Number(item.october || "0") +
        Number(item.november || "0") +
        Number(item.december || "0")
      ).toString(),
      Jan: item.january ? Number(item.january) : "0",
      Feb: item.february ? Number(item.february) : "0",
      Mar: item.march ? Number(item.march) : "0",
      Q4: (
        Number(item.january || "0") +
        Number(item.february || "0") +
        Number(item.march || "0")
      ).toString(),
      Qty1: item.qty1 ? Number(item.qty1) : 0,
      Qty2: item.qty2 ? Number(item.qty2) : 0,
      Qty3: item.qty3 ? Number(item.qty3) : 0,
      Qty4: item.qty4 ? Number(item.qty4) : 0,
      budgetDetailsId: Number(item.id),
      Total: (
        Number(item.january || 0) +
        Number(item.february || 0) +
        Number(item.march || 0) +
        Number(item.april || 0) +
        Number(item.may || 0) +
        Number(item.june || 0) +
        Number(item.july || 0) +
        Number(item.august || 0) +
        Number(item.september || 0) +
        Number(item.october || 0) +
        Number(item.november || 0) +
        Number(item.december || 0)
      ).toString(),
    } as any;

    avgQty[item.subcategoryId] = {
      Apr: Number(item.april) / (item.qty1 ? Number(item.qty1) : 1),
      May: Number(item.may) / (item.qty1 ? Number(item.qty1) : 1),
      Jun: Number(item.june) / (item.qty1 ? Number(item.qty1) : 1),
      Jul: Number(item.july) / (item.qty2 ? Number(item.qty2) : 1),
      Aug: Number(item.august) / (item.qty2 ? Number(item.qty2) : 1),
      Sep: Number(item.september) / (item.qty2 ? Number(item.qty2) : 1),
      Oct: Number(item.october) / (item.qty3 ? Number(item.qty3) : 1),
      Nov: Number(item.november) / (item.qty3 ? Number(item.qty3) : 1),
      Dec: Number(item.december) / (item.qty3 ? Number(item.qty3) : 1),
      Jan: Number(item.january) / (item.qty4 ? Number(item.qty4) : 1),
      Feb: Number(item.february) / (item.qty4 ? Number(item.qty4) : 1),
      Mar: Number(item.march) / (item.qty4 ? Number(item.qty4) : 1),
    };

    totals.totalFY +=
      Number(item.january) +
      Number(item.february) +
      Number(item.march) +
      Number(item.april) +
      Number(item.may) +
      Number(item.june) +
      Number(item.july) +
      Number(item.august) +
      Number(item.september) +
      Number(item.october) +
      Number(item.november) +
      Number(item.december);
    totals.totalQ1 += Number(item.april) + Number(item.may) + Number(item.june);
    totals.totalQ2 += Number(item.july) + Number(item.august) + Number(item.september);
    totals.totalQ3 += Number(item.october) + Number(item.november) + Number(item.december);
    totals.totalQ4 += Number(item.january) + Number(item.february) + Number(item.march);
  });

  return { tableData, avgQty, totals };
}

export function applyLevelStats(
  initialData: TableData,
  initialAvgQty: avgQtySchema,
  subCategories: SubCategory[],
  levelStats: any[]
) {
  const tableData: TableData = { ...initialData };
  const avgQty: avgQtySchema = { ...initialAvgQty };
  const totals: totalschema = { totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0, totalFY: 0 };

  let aprOSum = 0, mayOSum = 0, junOSum = 0, julOSum = 0, augOSum = 0, sepOSum = 0,
      octOSum = 0, novOSum = 0, decOSum = 0, janOSum = 0, febOSum = 0, marOSum = 0,
      q1OSum = 0, q2OSum = 0, q3OSum = 0, q4OSum = 0;

  subCategories.forEach((sub) => {
    const levelData = levelStats?.find((l) => l.level === sub.subCategoryId);
    console.log(levelData, "levelData");
    const employeeCount = levelData ? levelData.employeeCount : 0;
    const salarySum = levelData?.salarySum ? Number(levelData?.salarySum) : 0;
    const epfSum = levelData?.epfSum ? Number(levelData?.epfSum) : 0;
    const insuranceSum = levelData?.insuranceSum ? Number(levelData?.insuranceSum) : 0;
    const pwgPldSum = levelData?.pgwPldSum ? Number(levelData?.pgwPldSum) : 0;
    const bonusSum = levelData?.bonusSum ? Number(levelData?.bonusSum) : 0;
    const gratuitySum = levelData?.gratuitySum ? Number(levelData?.gratuitySum) : 0;

    if (sub.subCategoryId <= 14) {
      q1OSum += Number(employeeCount);
      q2OSum += Number(employeeCount);
      q3OSum += Number(employeeCount);
      q4OSum += Number(employeeCount);

      aprOSum += epfSum + insuranceSum;
      mayOSum += epfSum + pwgPldSum / 4;
      junOSum += epfSum;
      julOSum += epfSum;
      augOSum += epfSum + pwgPldSum / 4;
      sepOSum += epfSum;
      octOSum += epfSum;
      novOSum += epfSum;
      decOSum += epfSum + pwgPldSum / 4;
      janOSum += epfSum + bonusSum + pwgPldSum / 4;
      febOSum += epfSum + gratuitySum;
      marOSum += epfSum;

      tableData[sub.subCategoryId] = {
        Count: employeeCount,
        Qty1: employeeCount,
        Qty2: employeeCount,
        Qty3: employeeCount,
        Qty4: employeeCount,
        Apr: salarySum,
        May: salarySum,
        Jun: salarySum,
        Q1: salarySum * 3,
        Jul: salarySum,
        Aug: salarySum,
        Sep: salarySum,
        Q2: salarySum * 3,
        Oct: salarySum,
        Nov: salarySum,
        Dec: salarySum,
        Q3: salarySum * 3,
        Jan: salarySum,
        Feb: salarySum,
        Mar: salarySum,
        Q4: salarySum * 3,
        Total: salarySum * 12,
        budgetDetailsId: 0,
      } as any;

      avgQty[sub.subCategoryId] = {
        Apr: employeeCount != 0 ? salarySum / employeeCount : 0,
        May: employeeCount != 0 ? salarySum / employeeCount : 0,
        Jun: employeeCount != 0 ? salarySum / employeeCount : 0,
        Jul: employeeCount != 0 ? salarySum / employeeCount : 0,
        Aug: employeeCount != 0 ? salarySum / employeeCount : 0,
        Sep: employeeCount != 0 ? salarySum / employeeCount : 0,
        Oct: employeeCount != 0 ? salarySum / employeeCount : 0,
        Nov: employeeCount != 0 ? salarySum / employeeCount : 0,
        Dec: employeeCount != 0 ? salarySum / employeeCount : 0,
        Jan: employeeCount != 0 ? salarySum / employeeCount : 0,
        Feb: employeeCount != 0 ? salarySum / employeeCount : 0,
        Mar: employeeCount != 0 ? salarySum / employeeCount : 0,
      };
    } else {
      tableData[sub.subCategoryId] = {
        Count: employeeCount,
        Qty1: q1OSum,
        Qty2: q2OSum,
        Qty3: q3OSum,
        Qty4: q4OSum,
        Apr: aprOSum,
        May: mayOSum,
        Jun: junOSum,
        Q1: aprOSum + mayOSum + junOSum,
        Jul: julOSum,
        Aug: augOSum,
        Sep: sepOSum,
        Q2: julOSum + augOSum + sepOSum,
        Oct: octOSum,
        Nov: novOSum,
        Dec: decOSum,
        Q3: octOSum + novOSum + decOSum,
        Jan: janOSum,
        Feb: febOSum,
        Mar: marOSum,
        Q4: janOSum + febOSum + marOSum,
        Total:
          aprOSum + mayOSum + junOSum + julOSum + augOSum + sepOSum +
          octOSum + novOSum + decOSum + janOSum + febOSum + marOSum,
        budgetDetailsId: 0,
      } as any;

      avgQty[sub.subCategoryId] = {
        Apr: employeeCount != 0 ? aprOSum / q1OSum : 0,
        May: employeeCount != 0 ? mayOSum / q1OSum : 0,
        Jun: employeeCount != 0 ? junOSum / q1OSum : 0,
        Jul: employeeCount != 0 ? julOSum / employeeCount : 0,
        Aug: employeeCount != 0 ? augOSum / employeeCount : 0,
        Sep: employeeCount != 0 ? sepOSum / employeeCount : 0,
        Oct: employeeCount != 0 ? octOSum / employeeCount : 0,
        Nov: employeeCount != 0 ? novOSum / employeeCount : 0,
        Dec: employeeCount != 0 ? decOSum / employeeCount : 0,
        Jan: employeeCount != 0 ? janOSum / employeeCount : 0,
        Feb: employeeCount != 0 ? febOSum / employeeCount : 0,
        Mar: employeeCount != 0 ? marOSum / employeeCount : 0,
      };
    }

    totals.totalFY +=
      salarySum + epfSum + salarySum + epfSum + pwgPldSum / 4 + salarySum + epfSum +
      salarySum + epfSum + salarySum + epfSum + pwgPldSum / 4 + salarySum + epfSum +
      salarySum + epfSum + salarySum + epfSum + salarySum + epfSum + pwgPldSum / 4 +
      salarySum + epfSum + bonusSum + pwgPldSum / 4 + salarySum + epfSum +
      gratuitySum + salarySum + epfSum;

    totals.totalQ1 += salarySum + epfSum + salarySum + epfSum + pwgPldSum / 4 + salarySum + epfSum;
    totals.totalQ2 += salarySum + epfSum + salarySum + epfSum + pwgPldSum / 4 + salarySum + epfSum;
    totals.totalQ3 += salarySum + epfSum + salarySum + epfSum + pwgPldSum / 4 + salarySum + epfSum;
    totals.totalQ4 += salarySum + epfSum + bonusSum + pwgPldSum / 4 + salarySum + epfSum + gratuitySum + salarySum + epfSum;
  });

  return { tableData, avgQty, totals };
}

export function handlePersonnelSaveSuccess(
  response: { data: { subcategoryId: number; budgetDetailsId: number }[] },
  setTableData: React.Dispatch<React.SetStateAction<TableData>>,
  handelnputDisable: (disable: boolean) => void,
  setSaveBtnState: (state: "loading" | "edit" | "save") => void
) {
  import("react-toastify").then(({ toast }) => {
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
}

export function handlePersonnelSaveError(
  setSaveBtnState: (state: "loading" | "edit" | "save") => void
) {
  import("react-toastify").then(({ toast }) => {
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
  });
  setSaveBtnState("save");
}



import { TableData, totalschema, avgQtySchema, LevelData } from "../types/personnelCost";

type SubCategory = { subCategoryId: number };

type QuarterKey = "Q1" | "Q2" | "Q3" | "Q4";

type BudgetResultSource = {
  subcategoryId: number;
  total?: unknown;
  april?: unknown;
  may?: unknown;
  june?: unknown;
  july?: unknown;
  august?: unknown;
  september?: unknown;
  october?: unknown;
  november?: unknown;
  december?: unknown;
  january?: unknown;
  february?: unknown;
  march?: unknown;
  qty1?: unknown;
  qty2?: unknown;
  qty3?: unknown;
  qty4?: unknown;
  id?: unknown;
};

type LevelStat = {
  level: unknown;
  employeeCount?: unknown;
  salarySum?: unknown;
  insuranceSum?: unknown;
  bonusSum?: unknown;
  gratuitySum?: unknown;
  epfSum?: unknown;
  pgwPldSum?: unknown;
};

function toNumber(value: unknown): number {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? num : 0;
}

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
  result: BudgetResultSource[]
) {
  const tableData: TableData = { ...initialData };
  const avgQty: avgQtySchema = { ...initialAvgQty };
  const totals: totalschema = { totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0, totalFY: 0 };

  result.forEach((item) => {
    const count = toNumber(item.total);
    const apr = toNumber(item.april);
    const may = toNumber(item.may);
    const jun = toNumber(item.june);
    const jul = toNumber(item.july);
    const aug = toNumber(item.august);
    const sep = toNumber(item.september);
    const oct = toNumber(item.october);
    const nov = toNumber(item.november);
    const dec = toNumber(item.december);
    const jan = toNumber(item.january);
    const feb = toNumber(item.february);
    const mar = toNumber(item.march);

    const qty1 = toNumber(item.qty1);
    const qty2 = toNumber(item.qty2);
    const qty3 = toNumber(item.qty3);
    const qty4 = toNumber(item.qty4);
    const budgetDetailsId = toNumber(item.id);

    const q1Total = apr + may + jun;
    const q2Total = jul + aug + sep;
    const q3Total = oct + nov + dec;
    const q4Total = jan + feb + mar;
    const totalFy = q1Total + q2Total + q3Total + q4Total;

    const updatedRow: LevelData = {
      Count: count,
      Apr: apr,
      May: may,
      Jun: jun,
      Q1: q1Total.toString(),
      Jul: jul,
      Aug: aug,
      Sep: sep,
      Q2: q2Total.toString(),
      Oct: oct,
      Nov: nov,
      Dec: dec,
      Q3: q3Total.toString(),
      Jan: jan,
      Feb: feb,
      Mar: mar,
      Q4: q4Total.toString(),
      Qty1: qty1,
      Qty2: qty2,
      Qty3: qty3,
      Qty4: qty4,
      budgetDetailsId,
      Total: totalFy.toString(),
    };

    tableData[item.subcategoryId] = updatedRow;

    avgQty[item.subcategoryId] = {
      Apr: qty1 ? apr / qty1 : 0,
      May: qty1 ? may / qty1 : 0,
      Jun: qty1 ? jun / qty1 : 0,
      Jul: qty2 ? jul / qty2 : 0,
      Aug: qty2 ? aug / qty2 : 0,
      Sep: qty2 ? sep / qty2 : 0,
      Oct: qty3 ? oct / qty3 : 0,
      Nov: qty3 ? nov / qty3 : 0,
      Dec: qty3 ? dec / qty3 : 0,
      Jan: qty4 ? jan / qty4 : 0,
      Feb: qty4 ? feb / qty4 : 0,
      Mar: qty4 ? mar / qty4 : 0,
    };

    totals.totalFY += totalFy;
    totals.totalQ1 += q1Total;
    totals.totalQ2 += q2Total;
    totals.totalQ3 += q3Total;
    totals.totalQ4 += q4Total;
  });

  return { tableData, avgQty, totals };
}

export function applyLevelStats(
  initialData: TableData,
  initialAvgQty: avgQtySchema,
  subCategories: SubCategory[],
  levelStats: LevelStat[] = []
) {
  const tableData: TableData = { ...initialData };
  const avgQty: avgQtySchema = { ...initialAvgQty };
  const totals: totalschema = { totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0, totalFY: 0 };

  let aprOSum = 0, mayOSum = 0, junOSum = 0, julOSum = 0, augOSum = 0, sepOSum = 0,
      octOSum = 0, novOSum = 0, decOSum = 0, janOSum = 0, febOSum = 0, marOSum = 0,
      q1OSum = 0, q2OSum = 0, q3OSum = 0, q4OSum = 0;

  subCategories.forEach((sub) => {
    const levelData = levelStats.find((l) => toNumber(l.level) === sub.subCategoryId);
    console.log(levelData, "levelData");
    const employeeCount = toNumber(levelData?.employeeCount);
    const salarySum = toNumber(levelData?.salarySum);
    const epfSum = toNumber(levelData?.epfSum);
    const insuranceSum = toNumber(levelData?.insuranceSum);
    const pwgPldSum = toNumber(levelData?.pgwPldSum);
    const bonusSum = toNumber(levelData?.bonusSum);
    const gratuitySum = toNumber(levelData?.gratuitySum);

    if (sub.subCategoryId <= 14) {
      q1OSum += employeeCount;
      q2OSum += employeeCount;
      q3OSum += employeeCount;
      q4OSum += employeeCount;

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
      };

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
      };

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

export function applyQuarterStats(
  initialData: TableData,
  initialAvgQty: avgQtySchema,
  subCategories: SubCategory[],
  quarterStats: Record<QuarterKey, LevelStat[] | undefined>,
) {
  const tableData: TableData = { ...initialData };
  const avgQty: avgQtySchema = { ...initialAvgQty };
  const totals: totalschema = {
    totalQ1: 0,
    totalQ2: 0,
    totalQ3: 0,
    totalQ4: 0,
    totalFY: 0,
  };

  const aggregate = {
    qty: {
      Q1: 0,
      Q2: 0,
      Q3: 0,
      Q4: 0,
    },
    months: {
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
    },
  };

  const aggregatedSubCategoryIds: number[] = [];

  const getStatsForLevel = (q: QuarterKey, levelId: number) => {
    const stats: LevelStat[] = quarterStats[q] ?? [];
    return stats.find((item) => toNumber(item.level) === levelId);
  };

  subCategories.forEach((sub) => {
    const levelId = sub.subCategoryId;
    const q1Stats = getStatsForLevel("Q1", levelId);
    const q2Stats = getStatsForLevel("Q2", levelId);
    const q3Stats = getStatsForLevel("Q3", levelId);
    const q4Stats = getStatsForLevel("Q4", levelId);

    const empQ1 = toNumber(q1Stats?.employeeCount);
    const empQ2 = toNumber(q2Stats?.employeeCount);
    const empQ3 = toNumber(q3Stats?.employeeCount);
    const empQ4 = toNumber(q4Stats?.employeeCount);

    const salaryQ1 = toNumber(q1Stats?.salarySum);
    const salaryQ2 = toNumber(q2Stats?.salarySum);
    const salaryQ3 = toNumber(q3Stats?.salarySum);
    const salaryQ4 = toNumber(q4Stats?.salarySum);

    const epfQ1 = toNumber(q1Stats?.epfSum);
    const epfQ2 = toNumber(q2Stats?.epfSum);
    const epfQ3 = toNumber(q3Stats?.epfSum);
    const epfQ4 = toNumber(q4Stats?.epfSum);

    const insuranceQ1 = toNumber(q1Stats?.insuranceSum);
    const insuranceQ2 = toNumber(q2Stats?.insuranceSum);
    const insuranceQ3 = toNumber(q3Stats?.insuranceSum);
    const insuranceQ4 = toNumber(q4Stats?.insuranceSum);

    const pwgQ1 = toNumber(q1Stats?.pgwPldSum);
    const pwgQ2 = toNumber(q2Stats?.pgwPldSum);
    const pwgQ3 = toNumber(q3Stats?.pgwPldSum);
    const pwgQ4 = toNumber(q4Stats?.pgwPldSum);

    const bonusQ4 = toNumber(q4Stats?.bonusSum);
    const gratuityQ4 = toNumber(q4Stats?.gratuitySum);

    const totalEmployees = empQ1 + empQ2 + empQ3 + empQ4;

    if (levelId <= 14) {
      tableData[levelId] = {
        Count: totalEmployees,
        Qty1: empQ1,
        Qty2: empQ2,
        Qty3: empQ3,
        Qty4: empQ4,
        Apr: salaryQ1,
        May: salaryQ1,
        Jun: salaryQ1,
        Q1: salaryQ1 * 3,
        Jul: salaryQ2,
        Aug: salaryQ2,
        Sep: salaryQ2,
        Q2: salaryQ2 * 3,
        Oct: salaryQ3,
        Nov: salaryQ3,
        Dec: salaryQ3,
        Q3: salaryQ3 * 3,
        Jan: salaryQ4,
        Feb: salaryQ4,
        Mar: salaryQ4,
        Q4: salaryQ4 * 3,
        Total: salaryQ1 * 3 + salaryQ2 * 3 + salaryQ3 * 3 + salaryQ4 * 3,
        budgetDetailsId: 0,
      };

      avgQty[levelId] = {
        Apr: empQ1 ? salaryQ1 / empQ1 : 0,
        May: empQ1 ? salaryQ1 / empQ1 : 0,
        Jun: empQ1 ? salaryQ1 / empQ1 : 0,
        Jul: empQ2 ? salaryQ2 / empQ2 : 0,
        Aug: empQ2 ? salaryQ2 / empQ2 : 0,
        Sep: empQ2 ? salaryQ2 / empQ2 : 0,
        Oct: empQ3 ? salaryQ3 / empQ3 : 0,
        Nov: empQ3 ? salaryQ3 / empQ3 : 0,
        Dec: empQ3 ? salaryQ3 / empQ3 : 0,
        Jan: empQ4 ? salaryQ4 / empQ4 : 0,
        Feb: empQ4 ? salaryQ4 / empQ4 : 0,
        Mar: empQ4 ? salaryQ4 / empQ4 : 0,
      };

      const q1Total = salaryQ1 * 3;
      const q2Total = salaryQ2 * 3;
      const q3Total = salaryQ3 * 3;
      const q4Total = salaryQ4 * 3;

      totals.totalQ1 += q1Total;
      totals.totalQ2 += q2Total;
      totals.totalQ3 += q3Total;
      totals.totalQ4 += q4Total;
      totals.totalFY += q1Total + q2Total + q3Total + q4Total;

      aggregate.qty.Q1 += empQ1;
      aggregate.qty.Q2 += empQ2;
      aggregate.qty.Q3 += empQ3;
      aggregate.qty.Q4 += empQ4;

      aggregate.months.Apr += epfQ1 + insuranceQ1;
      aggregate.months.May += epfQ1 + pwgQ1 / 4;
      aggregate.months.Jun += epfQ1;
      aggregate.months.Jul += epfQ2;
      aggregate.months.Aug += epfQ2 + pwgQ2 / 4;
      aggregate.months.Sep += epfQ2;
      aggregate.months.Oct += epfQ3;
      aggregate.months.Nov += epfQ3;
      aggregate.months.Dec += epfQ3 + pwgQ3 / 4;
      aggregate.months.Jan += epfQ4 + bonusQ4 + pwgQ4 / 4;
      aggregate.months.Feb += epfQ4 + gratuityQ4;
      aggregate.months.Mar += epfQ4;
    } else {
      aggregatedSubCategoryIds.push(levelId);
    }
  });

  let aggregateTotalsCounted = false;

  aggregatedSubCategoryIds.forEach((subId) => {
    const qty1 = aggregate.qty.Q1;
    const qty2 = aggregate.qty.Q2;
    const qty3 = aggregate.qty.Q3;
    const qty4 = aggregate.qty.Q4;
    const totalCount = qty1 + qty2 + qty3 + qty4;

    const apr = aggregate.months.Apr;
    const may = aggregate.months.May;
    const jun = aggregate.months.Jun;
    const jul = aggregate.months.Jul;
    const aug = aggregate.months.Aug;
    const sep = aggregate.months.Sep;
    const oct = aggregate.months.Oct;
    const nov = aggregate.months.Nov;
    const dec = aggregate.months.Dec;
    const jan = aggregate.months.Jan;
    const feb = aggregate.months.Feb;
    const mar = aggregate.months.Mar;

    const q1Total = apr + may + jun;
    const q2Total = jul + aug + sep;
    const q3Total = oct + nov + dec;
    const q4Total = jan + feb + mar;
    const totalFy = q1Total + q2Total + q3Total + q4Total;

    tableData[subId] = {
      Count: totalCount,
      Qty1: qty1,
      Qty2: qty2,
      Qty3: qty3,
      Qty4: qty4,
      Apr: apr,
      May: may,
      Jun: jun,
      Q1: q1Total,
      Jul: jul,
      Aug: aug,
      Sep: sep,
      Q2: q2Total,
      Oct: oct,
      Nov: nov,
      Dec: dec,
      Q3: q3Total,
      Jan: jan,
      Feb: feb,
      Mar: mar,
      Q4: q4Total,
      Total: totalFy,
      budgetDetailsId: 0,
    };

    avgQty[subId] = {
      Apr: qty1 ? apr / qty1 : 0,
      May: qty1 ? may / qty1 : 0,
      Jun: qty1 ? jun / qty1 : 0,
      Jul: qty2 ? jul / qty2 : 0,
      Aug: qty2 ? aug / qty2 : 0,
      Sep: qty2 ? sep / qty2 : 0,
      Oct: qty3 ? oct / qty3 : 0,
      Nov: qty3 ? nov / qty3 : 0,
      Dec: qty3 ? dec / qty3 : 0,
      Jan: qty4 ? jan / qty4 : 0,
      Feb: qty4 ? feb / qty4 : 0,
      Mar: qty4 ? mar / qty4 : 0,
    };

    if (!aggregateTotalsCounted) {
      totals.totalQ1 += q1Total;
      totals.totalQ2 += q2Total;
      totals.totalQ3 += q3Total;
      totals.totalQ4 += q4Total;
      totals.totalFY += totalFy;
      aggregateTotalsCounted = true;
    }
  });

  return { tableData, avgQty, totals };
}

export function handlePersonnelSaveSuccess(
  response: { data: { subcategoryId: number; budgetDetailsId: number }[] },
  setTableData: React.Dispatch<React.SetStateAction<TableData>>,
  handelnputDisable: (disable: boolean) => void,
  setSaveBtnState: (state: "loading" | "edit" | "save") => void
) {
  void import("react-toastify").then(({ toast }) => {
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
  void import("react-toastify").then(({ toast }) => {
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



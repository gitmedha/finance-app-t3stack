"use client";

import { Button } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "react-toastify";
import {
  getBaseStructure,
  headerMonth,
  monthToQuarter,
  months,
  monthFields,
  displayColumnMap,
  monthMap,
} from "./Constants/overHeadConstants";
import {
  totalschema,
  TableData,
  LevelData,
  BudgetDetailsCreate,
  BudgetDetailsUpdate,
  ProgramDataItem,
  OverHeadProps,
} from "./types/overHead";
import {
  handleCreateBudget,
  handleUpdateBudget,
  mapItemToBaseStructure,
  transformTableRowToBudgetDetail,
  transformTableRowToUpdateBudgetDetail,
  recalculateTotals,
  computeSimpleTotals,
  calculateQuarterlyValues,
  calculateQuarterlyTotalsFromColumnTotals,
} from "./Service/overHeadHelper";

const OverHeads: React.FC<OverHeadProps> = ({
  section,
  categoryId,
  budgetId,
  deptId,
  status,
  sectionOpen,
  setSectionOpen,
  subdepartmentId,
  financialYear,
  onTotalsChange,
}) => {
  const [saveBtnState, setSaveBtnState] = useState<"loading" | "edit" | "save">(
    "loading",
  );
  const userData = useSession();
  const [inputStates, setInputStates] = useState<boolean>(true);
  const [totalQty, setTotalQty] = useState<totalschema>({
    totalQ1: 0,
    totalQ2: 0,
    totalQ3: 0,
    totalQ4: 0,
    totalFY: 0,
  });
  const [tableData, setTableData] = useState<TableData>({});

  // api calls
  const { data: overHeadData, isLoading: overHeadDataLodaing } =
    api.get.getOverHeadsData.useQuery(
      {
        budgetId,
        catId: categoryId,
        deptId: Number(deptId),
        subDeptId: subdepartmentId,
        financialYear: financialYear,
      },
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: 0,
      },
    );
  const createBudgetDetails = api.post.addOverHeadsBudgetDetails.useMutation();
  const updateBudgetDetails =
    api.post.updateOverHeadsBudgetDetails.useMutation();

  useEffect(() => {
    if (
      overHeadData?.budgetId === budgetId &&
      overHeadData.subDeptId === subdepartmentId &&
      Array.isArray(overHeadData?.subCategories)
    ) {
      // 1️⃣ Build fresh initial rows
      const initialData: Partial<TableData> = {};
      overHeadData?.subCategories?.forEach((sub) => {
        initialData[sub.subCategoryId] = {
          ...getBaseStructure(),
        };
      });

      const totalQtyAfterBudgetDetails: totalschema = {
        totalQ1: 0,
        totalQ2: 0,
        totalQ3: 0,
        totalQ4: 0,
        totalFY: 0,
      };
      // 2️⃣ If result exists, fill values + update totals
      if (
        overHeadData?.result &&
        Array.isArray(overHeadData.result) &&
        overHeadData.result.length > 0
      ) {
        (overHeadData.result as ProgramDataItem[]).forEach((item, index) => {
          initialData[item.subcategoryId] = mapItemToBaseStructure(item);
          totalQtyAfterBudgetDetails.totalFY +=
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
          totalQtyAfterBudgetDetails.totalQ1 +=
            Number(item.april) + Number(item.may) + Number(item.june);
          totalQtyAfterBudgetDetails.totalQ2 +=
            Number(item.july) + Number(item.august) + Number(item.september);
          totalQtyAfterBudgetDetails.totalQ3 +=
            Number(item.october) +
            Number(item.november) +
            Number(item.december);
          totalQtyAfterBudgetDetails.totalQ4 +=
            Number(item.january) + Number(item.february) + Number(item.march);
        });
        console.log(
          "🔍 DEBUG: Final Q1 total:",
          totalQtyAfterBudgetDetails.totalQ1,
        );
        setSaveBtnState("edit");
      } else {
        setSaveBtnState("save");
      }

      // 3️⃣ Set once at the end
      setTableData(initialData as TableData);
      setTotalQty(totalQtyAfterBudgetDetails);
    }
  }, [overHeadData]);

  const updateTotalQtyVals = (which: string, difference: number) => {
    setTotalQty((prev) => {
      const updatedTotal = { ...prev };
      updatedTotal[which as keyof typeof prev] += difference;
      updatedTotal["totalFY" as keyof typeof prev] += difference;
      return updatedTotal;
    });
  };
  const handelnputDisable = (disable: boolean) => {
    setInputStates(disable); // 1️⃣ Set the state flag for rendering

    // 2️⃣ Loop through each subcategory (each table row)
    Object.keys(tableData).forEach((subcategoryId) => {
      // 3️⃣ For each month (Apr, May, Jun, ...)
      monthFields.forEach(({ short }) => {
        // 4️⃣ For each field type: Qty, Rate, Amt
        ["Qty", "Rate", "Amt"].forEach((suffix) => {
          const input = document.getElementById(
            `${subcategoryId}${short} ${suffix}`,
          ) as HTMLInputElement | null;
          if (input) input.disabled = disable;
        });

        // 5️⃣ Also disable the plain month total (Apr, May, ...)
        const totalInput = document.getElementById(
          `${subcategoryId}${short}`,
        ) as HTMLInputElement | null;
        if (totalInput) totalInput.disabled = disable;
      });
    });
  };
  const handleInputChange = (
    subCategoryId: number,
    month: string, // e.g., "apr qty", "jul", "dec amount"
    value: string,
  ) => {
    if (month.endsWith("notes")) {
      setTableData((prev) => {
        const updated = { ...prev };
        const row: LevelData = {
          ...getBaseStructure(),
          ...(updated[subCategoryId] ?? {}),
        };

        row[month as keyof LevelData] = value; // keep the text
        updated[subCategoryId] = row;
        return updated;
      });
      return;
    }

    setTableData((prev) => {
      const updatedData = { ...prev };
      const row = updatedData[subCategoryId];
      if (!row) return updatedData;

      const parts = month.split(" ");
      const baseMonth = parts[0] ?? "";
      const field = parts[1];
      const key = baseMonth as keyof LevelData;

      const isNumericInput = !isNaN(Number(value.trim()));
      const parsedValue = isNumericInput ? Number(value.trim()) : 0;

      // 1️⃣ If plain month field (e.g. "jul"), update quarter total
      if (!field) {
        const oldVal = Number(row?.[key] ?? 0);
        const quarter = monthToQuarter[key] ?? "";
        if (quarter !== undefined) {
          updateTotalQtyVals(quarter, parsedValue - oldVal);
        }

        row[key] = parsedValue;
      }

      // 2️⃣ If qty or rate is updated
      if (field === "qty" || field === "rate") {
        const qtyKey = `${key} qty`;
        const rateKey = `${key} rate`;
        const amtKey = `${key} amount`;

        const qty =
          field === "qty"
            ? parsedValue
            : Number(row?.[qtyKey as keyof LevelData] ?? 0);
        const rate =
          field === "rate"
            ? parsedValue
            : Number(row?.[rateKey as keyof LevelData] ?? 0);
        const amount = Number((qty * rate).toFixed(2));

        row[qtyKey as keyof LevelData] = qty;
        row[rateKey as keyof LevelData] = rate;
        row[amtKey as keyof LevelData] = amount;
        const mapped = monthMap[key as keyof typeof monthMap] ?? key;

        row[mapped] = amount; // Used for total calculation
      }

      // 3️⃣ Always update the raw input value
      if (field) {
        row[month as keyof LevelData] = parsedValue;
      }

      updatedData[subCategoryId] = row;
      return updatedData;
    });
  };
  const numericMonths = months.filter((m) => !m.endsWith("notes"));
  const isSaveDisabled = () => {
    return Object.values(tableData).some((subData) =>
      numericMonths.some((monthKey) => {
        const v = subData?.[monthKey as keyof LevelData];
        return v === undefined || v === null || v.toString().trim() === "";
      }),
    );
  };
  const handleSave = async () => {
    setSaveBtnState("loading");
    const budgetDetails = Object.entries(tableData).map(
      ([subCategoryId, data]) =>
        transformTableRowToBudgetDetail(
          subCategoryId,
          data,
          budgetId,
          categoryId,
          deptId,
          subdepartmentId,
          userData.data?.user.id ?? 1,
        ),
    );
    await handleCreateBudget({
      payload: budgetDetails as BudgetDetailsCreate[],
      createBudgetDetails,
      handelnputDisable,
      setSaveBtnState,
      onSuccess: () => {
        recalculateTotals(tableData, setTotalQty);
      },
    });
  };
  const handleUpdate = async () => {
    setSaveBtnState("loading");

    const updatedBudgetDetails = Object.entries(tableData).map(
      ([subCategoryId, data]) =>
        transformTableRowToUpdateBudgetDetail(
          subCategoryId,
          data,
          budgetId,
          categoryId,
          deptId,
          userData.data?.user.id ?? 1,
          subdepartmentId,
        ),
    );
    console.log(updatedBudgetDetails, "updatedBudgetDetails");
    await handleUpdateBudget({
      payload: updatedBudgetDetails as BudgetDetailsUpdate[],
      updateBudgetDetails,
      handelnputDisable,
      setSaveBtnState,
      onSuccess: () => {
        recalculateTotals(tableData, setTotalQty);
      },
    });
  };
  // Function to determine if a field is read-only (month names or Amt fields)
  const isReadOnlyField = (month: string) => {
    // Check if it's a month name only (Apr, May, etc.) or ends with "Amt"
    return !month.includes(" ") || month.endsWith(" amount");
  };
  function getDisplayColumn(raw: string) {
    const key = raw.trim().toLowerCase();
    return displayColumnMap[key] ?? raw;
  }
  useEffect(() => {
    if (onTotalsChange) {
      onTotalsChange(totalQty);
    }
  }, [totalQty]);
  const columnTotals = useMemo(
    () => computeSimpleTotals(tableData),
    [tableData],
  );
  console.log(status, "status");
  console.log(subdepartmentId, "subdepartmentId");
  console.log(deptId, "deptId");
  console.log(userData.data?.user.role, "userData");
  return (
    <div className="my-6 rounded-md bg-white shadow-lg">
      {/* <ToastContainer /> */}
      <details
        className={`group mx-auto w-full overflow-hidden rounded bg-[#F5F5F5] shadow transition-[max-height] duration-500`}
        open={sectionOpen == "OVERHEADS"}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <summary
          className="flex grid-cols-[1.2fr_repeat(5,1fr)_min-content] items-center justify-center gap-4 rounded-md border border-primary/20 bg-primary/10 p-2 font-medium text-primary transition-all hover:cursor-pointer hover:border-primary/40 hover:shadow-sm md:grid"
          onClick={(e) => {
            e.preventDefault();
            setSectionOpen(sectionOpen === "OVERHEADS" ? null : "OVERHEADS");
          }}
        >
          {[
            // 1) Section title in col 1
            <h1 key="section" className="text-md capitalize">
              {section.toLowerCase()}
            </h1>,

            // 2–6) Q1–Q4 + Total in cols 2–6
            ...(["Q1", "Q2", "Q3", "Q4", "Total"] as const).map((label) => (
              <div
                key={label}
                className="flex hidden flex-col items-center rounded-md border border-primary/20 bg-primary/5 px-3 py-1 md:flex lg:flex-row lg:justify-center lg:gap-1"
              >
                <span className="text-sm font-medium">{label}:</span>{" "}
                {(label === "Total"
                  ? totalQty.totalFY
                  : totalQty[`total${label}` as keyof typeof totalQty]
                ).toLocaleString("hi-IN")}
              </div>
            )),

            // 7) Arrow in col 7
            <span
              key="arrow"
              // className="text-lg font-bold transition-transform group-open:rotate-90"
              className="self-center justify-self-end text-lg font-bold transition-transform group-open:rotate-90"
            >
              →
            </span>,
          ]}
        </summary>

        <hr className="my-2 scale-x-150" />

        <div className="max-h-[70vh] overflow-auto bg-gray-50">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left text-sm text-gray-600">
                <th
                  rowSpan={2}
                  className="border bg-gray-200 p-2 capitalize"
                >
                  {"Particular".toLowerCase()}
                </th>
                {headerMonth?.map((month) => (
                  <th
                    key={month}
                    colSpan={month.includes("Q") ? 3 : 4}
                    className="sticky top-0 z-10 h-12 border bg-gray-200 border-b-2 border-l-4 border-gray-400 border-gray-500 p-2 text-center capitalize"
                  >
                    {month}
                  </th>
                ))}
              </tr>
              {/* second row: the sub-columns for each month */}
              <tr className="bg-gray-200 text-sm text-gray-600">
                {months.map((sub, idx) => (
                  <th
                    key={idx}
                    className={`p-2 text-center ${
                      sub.includes("qty") ? "border-l-4 border-gray-500" : "border-l-2 border-gray-300"
                    }`}
                  >
                    {getDisplayColumn(sub)}
                  </th>
                ))}
              </tr>
            </thead>

            {!overHeadDataLodaing && (
              <tbody>
                {overHeadData?.subCategories.map((sub,rowIdx) => (
                  <tr
                    key={sub.subCategoryId}
                    className="text-sm transition hover:bg-gray-100"
                  >
                    <td className="sticky left-0 z-30 border bg-white p-2 font-medium capitalize">
                      {sub.subCategoryName.toLowerCase()}
                    </td>

                    {months.map((month, key) => {
                        const row = tableData[sub.subCategoryId] ?? {} as LevelData;
                        
                          const quarterlyValues = calculateQuarterlyValues(row);
                       
                        const isQuarterField = month.startsWith("Q");
                        
                        // Get display value: use quarterly calculation for Q fields, otherwise use stored value
                        const displayVal = isQuarterField 
                          ? (quarterlyValues[month as keyof typeof quarterlyValues] ?? 0)
                          : (row[month as keyof LevelData] ?? "");
                        return (
                          <td
                            key={month}
                            className="border p-2"
                            style={{ minWidth: "100px" }}
                          >
                            <input
                              type={key % 6 === 0 ? "number" : "text"}
                              className={`w-full rounded border p-1 ${
                                (isQuarterField || isReadOnlyField(month)) ? "bg-gray-100" : ""
                              } ${month.endsWith("notes") ? "min-w-40" : ""}`}
                              value={displayVal}
                              id={sub.subCategoryId + month}
                              disabled={isQuarterField || inputStates || isReadOnlyField(month)}
                              onChange={(e) =>
                                handleInputChange(
                                  sub.subCategoryId,
                                  month,
                                  e.target.value,
                                )
                              }
                            />
                          </td>
                        );
                      })}
                  </tr>
                ))}
              </tbody>
            )}
            {!overHeadDataLodaing && (
              <tfoot>
                <tr className="bg-gray-100 text-sm font-semibold">
                  <td className="sticky left-0 z-10 border bg-gray-100 p-2 uppercase">
                    Total
                  </td>

                  {months.map((month, idx) => {
                      let val = columnTotals[month as keyof LevelData];
                      let display = "";

                      if (month.startsWith("Q")) {
                        // For Q fields, calculate quarterly totals
                        const quarterlyTotals = calculateQuarterlyTotalsFromColumnTotals(columnTotals);
                        val = quarterlyTotals[month] ?? 0;
                      }

                      display = month.endsWith(" notes")
                        ? "" // keep notes empty
                        : typeof val === "number"
                          ? Number(val).toLocaleString("hi-IN")
                          : (val ?? "");

                      return (
                        <td
                          key={`total-${idx}`}
                          className="border p-2 text-right"
                          style={{ minWidth: "100px" }}
                        >
                          {display}
                        </td>
                      );
                    })}
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {(deptId == "5" ||
          deptId == "7" ||
          deptId == "4" ||
          deptId == "8" ||
          deptId == "6" ||
          (subdepartmentId != 0 && deptId != "0")) &&
          ((userData.data?.user.role == 1 && status != "draft") ||
            (userData.data?.user.role != 1 && status == "draft")) && (
            <div className="flex flex-row-reverse gap-2 py-2 pr-4">
              {!inputStates && (
                <div>
                  {saveBtnState == "loading" && (
                    <Button
                      type="button"
                      className="!w-20 !cursor-not-allowed border border-black !bg-primary px-2 !text-lg !text-white"
                      variant="soft"
                    >
                      Loading...
                    </Button>
                  )}
                  {saveBtnState == "edit" && (
                    <Button
                      type="button"
                      className="!disabled:cursor-not-allowed !w-20 cursor-pointer border border-black !bg-primary px-2 !text-lg !text-white"
                      variant="soft"
                      style={{
                        cursor: isSaveDisabled() ? "not-allowed" : "pointer",
                      }}
                      disabled={isSaveDisabled()}
                      onClick={() => handleUpdate()}
                    >
                      Update
                    </Button>
                  )}
                  {saveBtnState == "save" && (
                    <Button
                      type="button"
                      className="!disabled:cursor-not-allowed !w-20 cursor-pointer border border-black !bg-primary px-2 !text-lg !text-white"
                      variant="soft"
                      style={{
                        cursor: isSaveDisabled() ? "not-allowed" : "pointer",
                      }}
                      disabled={isSaveDisabled()}
                      onClick={() => handleSave()}
                    >
                      Save
                    </Button>
                  )}
                </div>
              )}
              {inputStates ? (
                <Button
                  type="button"
                  className="!disabled:cursor-not-allowed !w-20 cursor-pointer border border-black !bg-primary px-2 !text-lg !text-white"
                  variant="soft"
                  style={{ cursor: "pointer" }}
                  onClick={() => handelnputDisable(false)}
                >
                  Edit
                </Button>
              ) : (
                <Button
                  type="button"
                  className="!disabled:cursor-not-allowed !w-20 cursor-pointer border border-primary px-2 !text-lg !text-primary"
                  variant="soft"
                  style={{ cursor: "pointer" }}
                  onClick={() => handelnputDisable(true)}
                >
                  Cancel
                </Button>
              )}
            </div>
          )}
      </details>
    </div>
  );
};

export default OverHeads;

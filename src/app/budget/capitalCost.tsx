import { Button } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { transformTableRowToBudgetDetail, transformTableRowToUpdateBudgetDetail, handleCreateBudget, handleUpdateBudget,recalculateTotals,mapItemToBaseStructure } from "./Service/capitalCostHelper";
import {TableData,
  totalschema,
  BudgetDetailsCreate,
  BudgetDetailsUpdate,
  CapitalCostProps,
  LevelData,
  CapitalCostDataItem,
} from "./types/capitalCost";
import { displayColumnMap,getBaseStructure, headerMonth,  monthMap, months, monthFields, monthToQuarter } from "./Constants/capitalCostConstants";




const CapitalCost: React.FC<CapitalCostProps> = ({ section, categoryId, budgetId, deptId, status, sectionOpen, setSectionOpen, subdepartmentId, financialYear,onTotalsChange }) => {
  const userData = useSession()
  const[inputStates,setInputStates] = useState<boolean>(true)
  const [saveBtnState,setSaveBtnState] = useState<"loading"|"edit"|"save">("loading")

  const [totalQty, setTotalQty] = useState<totalschema>({
    totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0,totalFY:0
  })
  const [tableData, setTableData] = useState<TableData>({});

  // api calls
  const { data: capitalCostData, isLoading: capitalCostDataLodaing } = api.get.getCapitalCostData.useQuery({
    budgetId,
    catId: categoryId,
    deptId: Number(deptId),
    subDeptId: subdepartmentId,
    financialYear:financialYear
  }, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
  })
  const createBudgetDetails = api.post.addCapitalCostBudgetDetails.useMutation();
  const updateBudgetDetails = api.post.updateCapitalCostBudgetDetails.useMutation();

  // useEffect hooks
  useEffect(() => {
    if (
      capitalCostData?.budgetId === budgetId &&
      capitalCostData.subDeptId === subdepartmentId &&
      Array.isArray(capitalCostData?.subCategories)
    ) {
      // 1️⃣ Build fresh initial rows
      const initialData: Partial<TableData> = {};
      capitalCostData?.subCategories?.forEach((sub) => {
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
        capitalCostData?.result &&
        Array.isArray(capitalCostData.result) &&
        capitalCostData.result.length > 0
      ) {
        (capitalCostData.result as CapitalCostDataItem[]).forEach((item, index) => {
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
        console.log('🔍 DEBUG: Final Q1 total:', totalQtyAfterBudgetDetails.totalQ1);
        setSaveBtnState("edit");
      } else {
        setSaveBtnState("save");
      }

      // 3️⃣ Set once at the end
      setTableData(initialData as TableData);
      setTotalQty(totalQtyAfterBudgetDetails);
    }
  }, [capitalCostData]);

  // other functions
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
  const updateTotalQtyVals = (which: string, difference: number) => {
    setTotalQty((prev) => {
      const updatedTotal = { ...prev };
      updatedTotal[which as keyof typeof prev] += difference;
      updatedTotal["totalFY" as keyof typeof prev]+=difference
      return updatedTotal;
    });
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
 

  return (
    <div className="my-6 rounded-md bg-white shadow-lg" >
      <details className="group mx-auto w-full overflow-hidden rounded bg-[#F5F5F5] shadow" open={sectionOpen == "CAPITAL COST"} 
        onClick={(e) =>{e.preventDefault() 
        }}>
        
        <summary className="flex cursor-pointer items-center justify-between gap-32 rounded-md border border-primary bg-primary/10 p-2 text-primary"
          onClick={(e) => {
            e.preventDefault()
            if (sectionOpen == "CAPITAL COST")
              setSectionOpen(null)
            else
              setSectionOpen("CAPITAL COST")
          }} >
          <h1 className="text-md w-full text-center font-medium capitalize md:w-1/6 md:text-left">{section.toLowerCase()}</h1>
          {
            capitalCostDataLodaing ? <div className="flex items-center space-x-2">
              <p className="text-sm">Loading.....</p>
            </div> : 
              <div className="hidden md:flex gap-20 w-5/6">
                <div className="bg-primary/5 px-3 py-1 rounded-md border border-primary/20 w-1/5">
                  <span className="font-medium text-sm">Q1:</span> {(totalQty.totalQ1).toLocaleString('hi-IN')}
                </div>
                <div className="bg-primary/5 px-3 py-1 rounded-md border border-primary/20 w-1/5">
                  <span className="font-medium text-sm">Q2:</span> {(totalQty.totalQ2).toLocaleString('hi-IN')}
                </div>
                <div className="bg-primary/5 px-3 py-1 rounded-md border border-primary/20 w-1/5">
                  <span className="font-medium text-sm">Q3:</span> {(totalQty.totalQ3).toLocaleString('hi-IN')}
                </div>
                <div className="bg-primary/5 px-3 py-1 rounded-md border border-primary/20 w-1/5">
                  <span className="font-medium text-sm">Q4:</span> {(totalQty.totalQ4).toLocaleString('hi-IN')}
                </div>
                <div className="bg-primary/5 px-3 py-1 rounded-md border border-primary/20 w-1/5">
                  <span className="font-medium text-sm">FY:</span> {(totalQty.totalFY).toLocaleString('hi-IN')}
                </div>
                <span className="text-lg font-bold transition-transform group-open:rotate-90">→</span>
              </div>
          }
          
        </summary>

        <hr className="my-2 scale-x-150" />
        <div className="bg-gray-50 overflow-scroll">
          <table className="w-full table-auto border-collapse">
          <thead>
              <tr className="bg-gray-200 text-left text-sm text-gray-600">
                <th rowSpan={2} className="border p-2 capitalize">
                  {"Particular".toLowerCase()}
                </th>
                {headerMonth?.map((month, idx) => (
                  <th
                    key={month}
                    colSpan={4}
                    className={`border border-b-2 border-gray-400 p-2 text-center capitalize ${"border-l-4 border-gray-500"} `}
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
                      idx % 4 === 0 || idx === 0
                        ? "border-l-4 border-gray-500"
                        : "border-l-2 border-gray-300"
                    } `}
                  >
                    {getDisplayColumn(sub)}
                  </th>
                ))}
              </tr>
            </thead>
            {
              !capitalCostDataLodaing && 
              <tbody>
              {capitalCostData?.subCategories.map((sub) => (
                <tr
                  key={sub.subCategoryId}
                  className="text-sm transition hover:bg-gray-100"
                >
                  <td className="border p-2 font-medium capitalize">
                    {sub.subCategoryName.toLowerCase()}
                  </td>
                  {months.map((month, key) => (
                    <td
                      key={month}
                      className="border p-2"
                      style={{ minWidth: "100px" }}
                    >
                      <input
                        type={key % 6 == 0 ? "number" : "text"}
                        className={`w-full rounded border p-1 ${
                          isReadOnlyField(month) ? "bg-gray-100" : ""
                        } ${month.endsWith("notes") ? "min-w-40" : ""}`}
                        value={tableData[sub.subCategoryId]?.[month] ?? ""}
                        id={sub.subCategoryId + month}
                        // disabled={(userData.data?.user.role == 1 && status == "draft") || (userData.data?.user.role == 2 && status != "draft")}
                        disabled={inputStates || isReadOnlyField(month)}
                        onChange={(e) =>
                          handleInputChange(
                            sub.subCategoryId,
                            month,
                            e.target.value,
                          )
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            }
            
          </table>
        </div>
          {
          subdepartmentId != 0 && deptId != "0" &&((userData.data?.user.role == 1 && status != "Draft") || (userData.data?.user.role != 1 && status == "Draft")) && <div className="py-2 pr-4 flex flex-row-reverse gap-2">
            {
              !inputStates && <div> {
                saveBtnState == "loading"  && <Button
                  type="button"
                  className=" !text-white !bg-primary px-2 !w-20 !text-lg border border-black !cursor-not-allowed"
                  variant="soft"
                >
                  Loading...
                </Button>
              }
                {
                  saveBtnState == "edit"  && <Button
                    type="button"
                    className="cursor-pointer !text-white !bg-primary px-2 !w-20 !text-lg border border-black !disabled:cursor-not-allowed"
                    variant="soft"
                    style={{ cursor: isSaveDisabled() ? "not-allowed" : "pointer" }}
                    disabled={isSaveDisabled()}
                    onClick={() => handleUpdate()}
                  >
                    Update
                  </Button>}

                {saveBtnState == "save"  && <Button
                  type="button"
                  className="cursor-pointer !text-white !bg-primary px-2 !w-20 !text-lg border border-black !disabled:cursor-not-allowed"
                  variant="soft"
                  style={{ cursor: isSaveDisabled() ? "not-allowed" : "pointer" }}
                  disabled={isSaveDisabled()}
                  onClick={() => handleSave()}
                >
                  Save
                </Button>

                }
              </div>
            }
            {inputStates ? <Button
              type="button"
              className="cursor-pointer !text-white !bg-primary px-2 !w-20 !text-lg border border-black !disabled:cursor-not-allowed"
              variant="soft"
              style={{ cursor: "pointer" }}
              onClick={() => handelnputDisable(false)}
            >
              Edit
            </Button> :
              <Button
                type="button"
                className="cursor-pointer !text-primary  px-2 !w-20 !text-lg border border-primary !disabled:cursor-not-allowed"
                variant="soft"
                style={{ cursor: "pointer" }}
                // disabled={isSaveDisabled()}
                onClick={() => handelnputDisable(true)}
              >
                Cancel
              </Button>
            }

          </div>
          }
        
      </details>
    </div>
  );
};

export default CapitalCost;

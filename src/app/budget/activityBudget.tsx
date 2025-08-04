"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { api } from "~/trpc/react";
import Marquee from "react-fast-marquee";
import {
  ActivityBudgetProps,
  totalschema,
  subProgramActivitesSchema,
  TableData,
  ProgramDataItem,
  BudgetDetailsCreate,
  BudgetDetailsUpdate,
  LevelData,
} from "./types/budget";
import {
  months,
  headerMonth,
  monthFields,
  getBaseStructure,
  monthMap,
  monthToQuarter,
  displayColumnMap,
} from "./Constants/budgetConstants";
import {
  handleCreateBudget,
  handleUpdateBudget,
  mapItemToBaseStructure,
  transformTableRowToBudgetDetail,
  transformTableRowToUpdateBudgetDetail,
  recalculateTotals,
} from "./Service/budgetHelper";
import { table } from "console";

const ActivityBudget: React.FC<ActivityBudgetProps> = ({
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
  const userData = useSession();
  console.log(userData, "userData");
  const [saveBtnState, setSaveBtnState] = useState<"loading" | "edit" | "save">(
    "loading",
  );
  const [inputStates, setInputStates] = useState<boolean>(true);
  const [totalQty, setTotalQty] = useState<totalschema>({
    totalQ1: 0,
    totalQ2: 0,
    totalQ3: 0,
    totalQ4: 0,
    totalFY: 0,
  });
  const [subProgramActivites, setSubProgramActivites] = useState<
    subProgramActivitesSchema[]
  >([{ map: 0, name: "All" }]);
  const [filter, setFilter] = useState<subProgramActivitesSchema>({
    map: 0,
    name: "All",
  });
  const [tableData, setTableData] = useState<Partial<TableData>>({});

  // Fetch program activities by department based on user role
  const { data: programActivitiesByDept } =
    api.get.getProgramActivitiesByDepartment.useQuery(
      {
        departmentId: Number(deptId),
        subDepartmentId: subdepartmentId ?? undefined,
        budgetid: budgetId,
        financialYear: financialYear,
      },
      {
        staleTime: 0,
      },
    );
  useEffect(() => {
    if (programActivitiesByDept) {
      setSubProgramActivites([
        { map: 0, name: "All" },
        ...programActivitiesByDept.map((item) => ({
          map: item.value,
          name: item.label,
        })),
      ]);
    }
  }, [programActivitiesByDept]);
  // api calls
  const { data: programData, isLoading: programDataLodaing } =
    api.get.getProgramActivities.useQuery(
      {
        budgetId,
        catId: categoryId,
        deptId: Number(deptId),
        activity: filter?.map?.toString(),
        subDeptId: subdepartmentId,
        financialYear,
      },
      {
        staleTime: 0,
      },
    );
  const createBudgetDetails = api.post.addBudgetDetails.useMutation();
  const updateBudgetDetails = api.post.updateBudgetDetails.useMutation();
  // useEffect to update program activities dropdown

  // useEffect hooks
  useEffect(() => {
    if (
      programData?.budgetId === budgetId &&
      programData.subDeptId === subdepartmentId &&
      Array.isArray(programData?.subCategories)
    ) {
      // 1️⃣ Build fresh initial rows
      const initialData: Partial<TableData> = {};
      programData?.subCategories?.forEach((sub) => {
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
        programData?.result &&
        Array.isArray(programData.result) &&
        programData.result.length > 0
      ) {
        (programData.result as ProgramDataItem[]).forEach((item) => {
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
        setSaveBtnState("edit");
      } else {
        setSaveBtnState("save");
      }

      // 3️⃣ Set once at the end
      setTableData(initialData);
      setTotalQty(totalQtyAfterBudgetDetails);
    }
  }, [programData]);

  useEffect(() => {
    handelnputDisable(true);
  }, [filter]);

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

  const handleSelect = (val: subProgramActivitesSchema) => {
    setFilter(val);
  };
  const updateTotalQtyVals = (which: string, difference: number) => {
    setTotalQty((prev) => {
      const updatedTotal = { ...prev };
      updatedTotal[which as keyof typeof prev] += difference;
      updatedTotal["totalFY" as keyof typeof prev] += difference;
      return updatedTotal;
    });
  };
  // Only consider the purely numeric fields (qty, rate, amount, and month totals)
  const numericMonths = months.filter((m) => !m.endsWith("notes"));

  const isSaveDisabled = () => {
    return Object.values(tableData).some((subData) =>
      numericMonths.some((monthKey) => {
        const v = subData?.[monthKey as keyof LevelData];
        return v === undefined || v === null || v.toString().trim() === "";
      }),
    );
  };

  // Function to determine if a field is read-only (month names or Amt fields)
  const isReadOnlyField = (month: string) => {
    // Check if it's a month name only (Apr, May, etc.) or ends with "Amt"
    return !month.includes(" ") || month.endsWith(" amount");
  };

  // Function to recalculate totals from current tableData

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

    // Recalculate totals after each input change
    // setTimeout(() => {
    //   recalculateTotals(tableData as TableData, setTotalQty);
    // }, 0);
  };

  // handle save
  const handleSave = async () => {
    setSaveBtnState("loading");
    const budgetDetails = Object.entries(tableData).map(
      ([subCategoryId, data]) =>
        transformTableRowToBudgetDetail(
          subCategoryId,
          data!,
          budgetId,
          categoryId,
          deptId,
          subdepartmentId,
          userData.data?.user.id ?? 1,
          filter.map,
        ),
    );
    await handleCreateBudget({
      payload: budgetDetails as BudgetDetailsCreate[],
      createBudgetDetails,
      handelnputDisable,
      setSaveBtnState,
      onSuccess: () => {
        recalculateTotals(tableData as TableData, setTotalQty);
      },
    });
  };

  const handleUpdate = async () => {
    setSaveBtnState("loading");

    const updatedBudgetDetails = Object.entries(tableData).map(
      ([subCategoryId, data]) =>
        transformTableRowToUpdateBudgetDetail(
          subCategoryId,
          data!,
          budgetId,
          categoryId,
          deptId,
          userData.data?.user.id ?? 1,
          subdepartmentId,
          filter?.map ?? 0,
        ),
    );
    console.log(updatedBudgetDetails, "updatedBudgetDetails");
    await handleUpdateBudget({
      payload: updatedBudgetDetails as BudgetDetailsUpdate[],
      updateBudgetDetails,
      handelnputDisable,
      setSaveBtnState,
      onSuccess: () => {
        recalculateTotals(tableData as TableData, setTotalQty);
      },
    });
  };

  useEffect(() => {
    if (onTotalsChange) {
      onTotalsChange(totalQty);
    }
  }, [totalQty]);

  function getDisplayColumn(raw: string) {
    const key = raw.trim().toLowerCase();
    return displayColumnMap[key] ?? raw;
  }
  console.log(tableData, "activityBudget tableData");
  console.log(programData, " activityBudget programData");
  return (
    <div className="my-6 rounded-md bg-white shadow-lg">
      <details
        className={`group mx-auto w-full overflow-hidden rounded bg-[#F5F5F5] shadow transition-[max-height] duration-500`}
        open={sectionOpen == "Program Activities"}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <summary
          className="flex grid-cols-[1.2fr_repeat(5,1fr)_min-content] items-center justify-center gap-4 rounded-md border border-primary/20 bg-primary/10 p-2 font-medium text-primary transition-all hover:cursor-pointer hover:border-primary/40 hover:shadow-sm md:grid"
          onClick={(e) => {
            e.preventDefault();
            setSectionOpen(
              sectionOpen === "Program Activities"
                ? null
                : "Program Activities",
            );
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
        <div className="flex items-center gap-2">
          <div className="mt-3 w-72">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex w-full cursor-pointer items-center justify-between rounded-lg border py-1 pl-2 text-left text-sm font-normal text-gray-500">
                  <span className="capitalize">{filter?.name} </span>
                  <RiArrowDropDownLine size={30} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
              <DropdownMenu.Content className="max-h-56 !w-[250px] overflow-y-scroll rounded-lg bg-white p-2 shadow-lg">
                {subProgramActivites
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((val, ind) => (
                    <DropdownMenu.Item
                      key={ind}
                      className="cursor-pointer rounded p-2 text-sm capitalize hover:bg-gray-100 focus:ring-0"
                      onSelect={() => handleSelect(val)}
                    >
                      {val.name}
                    </DropdownMenu.Item>
                  ))}
              </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
          <Marquee className="flex w-full flex-col items-end gap-1 pr-10 font-medium">
            {subProgramActivites.map((pa) => {
              if (pa.name == "All") return null;
              const activityData = programData?.activityTotals.find(
                (activity) => Number(activity.activityId) == pa.map,
              );
              return (
                <span key={pa.map} className="text-medium mr-2">
                  <span className="font-semibold text-green-800">
                    {" "}
                    {pa.name}
                  </span>{" "}
                  | FY :{" "}
                  {activityData
                    ? (
                        Number(activityData?.q1) +
                        Number(activityData?.q2) +
                        Number(activityData?.q3) +
                        Number(activityData?.q4)
                      ).toLocaleString("hi-IN")
                    : "NA"}{" "}
                  | Q1 :{" "}
                  {activityData
                    ? Number(activityData?.q1).toLocaleString("hi-IN")
                    : "NA"}{" "}
                  | Q2:{" "}
                  {activityData
                    ? Number(activityData?.q2).toLocaleString("hi-IN")
                    : "NA"}{" "}
                  | Q3 :{" "}
                  {activityData
                    ? Number(activityData?.q3).toLocaleString("hi-IN")
                    : "NA"}{" "}
                  | Q4:{" "}
                  {activityData
                    ? Number(activityData?.q4).toLocaleString("hi-IN")
                    : "NA"}
                </span>
              );
            })}
          </Marquee>
        </div>

        <hr className="my-2 scale-x-150" />

        <div className="overflow-scroll bg-gray-50">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left text-sm text-gray-600">
                  <th
                    rowSpan={2}
                    className="sticky left-0 z-20 border bg-gray-200 p-2 capitalize"
                  >
                    {"Particular".toLowerCase()}
                  </th>
                  {headerMonth?.map((month) => (
                    <th
                      key={month}
                      colSpan={4}
                      className="border border-b-2 border-l-4 border-gray-400 border-gray-500 p-2 text-center capitalize"
                    >
                      {month}
                    </th>
                  ))}
                </tr>
                <tr className="bg-gray-200 text-sm text-gray-600">
                  {months.map((sub, idx) => (
                    <th
                      key={idx}
                      className={`p-2 text-center ${
                        idx % 4 === 0
                          ? "border-l-4 border-gray-500"
                          : "border-l-2 border-gray-300"
                      }`}
                    >
                      {getDisplayColumn(sub)}
                    </th>
                  ))}
                </tr>
              </thead>

              {!programDataLodaing && (
                <tbody>
                  {programData?.subCategories.map((sub) => (
                    <tr
                      key={sub.subCategoryId}
                      className="text-sm transition hover:bg-gray-100"
                    >
                      <td className="sticky left-0 z-10 border bg-white p-2 font-medium capitalize">
                        {sub.subCategoryName.toLowerCase()}
                      </td>
                      {months.map((month) => (
                        <td
                          key={month}
                          className="border p-2"
                          style={{ minWidth: "100px" }}
                        >
                          <input
                            disabled={inputStates || isReadOnlyField(month)}
                            type={month.endsWith("notes") ? "text" : "number"}
                            placeholder={
                              month.endsWith("notes")
                                ? "Enter notes…"
                                : undefined
                            }
                            className={`w-full rounded border p-1 ${
                              isReadOnlyField(month) ? "bg-gray-100" : ""
                            } ${month.endsWith("notes") ? "min-w-40" : ""}`}
                            value={
                              tableData[sub.subCategoryId]?.[
                                month as keyof LevelData
                              ] ?? ""
                            }
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
              )}
            </table>
          </div>
        </div>
        {filter?.map != 0 &&
          subdepartmentId != 0 &&
          deptId != "0" &&
          ((userData.data?.user.role == 1 && status != "Draft") ||
            (userData.data?.user.role != 1 && status == "Draft")) && (
            <div className="flex flex-row-reverse gap-2 py-2 pr-4">
              {!inputStates && (
                <div>
                  {saveBtnState == "loading" && (
                    <Button
                      type="button"
                      className="!w-20 !cursor-not-allowed border border-black !bg-primary px-2 !text-lg !text-white"
                      variant="soft"
                      // Disable the button if input is empty
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

export default ActivityBudget;

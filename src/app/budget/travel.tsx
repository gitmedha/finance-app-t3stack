"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { api } from "~/trpc/react";
import Marquee from "react-fast-marquee";
import {
  totalschema,
  TravelBudgetProps,
  subTravelSchema,
  TableData,
  BudgetDetails,
  UpdateTravelBudgetDetails,
  TravelDataItem,
} from "./types/travel";
import {
  subTravels,
  months,
  getBaseStructure,
  headerMonth,
  monthToQuarter,
  displayNameMap,
  displayColumnMap,
  monthMap,
} from "./Constants/travelConstants";
import {
  transformTableRowToBudgetDetail,
  handleSaveSuccess,
  handleSaveError,
  handleUpdateSuccess,
  handleUpdateError,
  transformTableRowToUpdateBudgetDetail,
  mapItemToBaseStructure,
} from "./Service/travelHelper";

const TravelBudget: React.FC<TravelBudgetProps> = ({
  section,
  categoryId,
  budgetId,
  deptId,
  searchSubCatId,
  status,
  sectionOpen,
  setSectionOpen,
  subdepartmentId,
  financialYear,
  onTotalsChange,
}) => {
  const userData = useSession();
  const [inputStates, setInputStates] = useState<boolean>(true);
  const [saveBtnState, setSaveBtnState] = useState<"loading" | "edit" | "save">(
    "loading",
  );
  const [totalQty, setTotalQty] = useState<totalschema>({
    totalQ1: 0,
    totalQ2: 0,
    totalQ3: 0,
    totalQ4: 0,
    totalFY: 0,
  });
  const [tableData, setTableData] = useState<TableData>({});
  const [filter, setFilter] = useState(subTravels[0]);

  //api call
  const { data: travelData, isLoading: travelDataLodaing } =
    api.get.getTravelCatDetials.useQuery(
      {
        budgetId,
        catId: categoryId,
        deptId: Number(deptId),
        travel_typeid: filter?.id,
        searchSubCatId: searchSubCatId,
        subDeptId: subdepartmentId,
        financialYear,
      },
      {
        staleTime: 0,
      },
    );
  const createBudgetDetails = api.post.saveTravelBudgetDetails.useMutation();
  const updateBudgetDetails = api.post.updateTravelBudgetDetails.useMutation();

  //use effect hook
  useEffect(() => {
    if (
      travelData?.budgetId == budgetId &&
      travelData.subDeptId == subdepartmentId
    ) {
      const initialData: TableData = {};
      if (travelData?.subCategories) {
        travelData.subCategories.forEach((sub) => {
          initialData[sub.subCategoryId] = {
            ...getBaseStructure(),
          };
        });
        if (travelData.result && travelData.result.length > 0) {
          setSaveBtnState("edit");
          const totalQtyAfterBudgetDetails: totalschema = {
            totalQ1: 0,
            totalQ2: 0,
            totalQ3: 0,
            totalQ4: 0,
            totalFY: 0,
          };
          console.log(travelData.result, "travelData.result");
          (travelData.result as TravelDataItem[]).forEach((item) => {
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
          setTableData(initialData);
          setTotalQty(totalQtyAfterBudgetDetails);
        } else if (travelData.levelStats || travelData.personalData) {
          const totalQtyAfterBudgetDetails: totalschema = {
            totalQ1: 0,
            totalQ2: 0,
            totalQ3: 0,
            totalQ4: 0,
            totalFY: 0,
          };
          setTotalQty(totalQtyAfterBudgetDetails);
          setSaveBtnState("save");
          travelData.subCategories.forEach((sub) => {
            if (travelData.personalData && travelData.personalData.length > 0) {
              const level = travelData.personalData.find(
                (level) => level.subcategoryId === sub.subCategoryId,
              );
              if (filter?.id == 0) {
                initialData[sub.subCategoryId] = { ...getBaseStructure() };
              } else {
                initialData[sub.subCategoryId] = { ...getBaseStructure() };
              }
            } else {
              const level = travelData.levelStats?.find(
                (level) => level.level === sub.subCategoryId,
              );
              if (filter?.id == 0) {
                initialData[sub.subCategoryId] = { ...getBaseStructure() };
              } else {
                initialData[sub.subCategoryId] = { ...getBaseStructure() };
              }
            }
          });
          setTableData(initialData);
        }
      }
    }
  }, [travelData]);

  useEffect(() => {
    handelnputDisable(true);
  }, [filter]);

  const isSaveDisabled = () => {
    console.log(tableData, "travel tableData");
    return Object.values(tableData).some((subData) => {
      return months.some((month) => {
        return !subData[month]?.toString().trim();
        // return val === undefined || val === null || val.toString().trim() === "";
      });
    });
  };
  const handleSubCatSelect = (val: subTravelSchema) => {
    setSaveBtnState("loading");
    setFilter(val);
  };
  const handelnputDisable = (disable: boolean) => {
    const subcategoryIds = [];
    setInputStates(disable);
    for (const [subcategoryId] of Object.entries(tableData)) {
      subcategoryIds.push(subcategoryId);
    }
    subcategoryIds.forEach((id) => {
      const rate1In = document.getElementById(id + "Rate1") as HTMLInputElement;
      const rate2In = document.getElementById(id + "Rate2") as HTMLInputElement;
      const rate3In = document.getElementById(id + "Rate3") as HTMLInputElement;
      const rate4In = document.getElementById(id + "Rate4") as HTMLInputElement;
      const qty1In = document.getElementById(id + "Qty1") as HTMLInputElement;
      const qty2In = document.getElementById(id + "Qty2") as HTMLInputElement;
      const qty3In = document.getElementById(id + "Qty3") as HTMLInputElement;
      const qty4In = document.getElementById(id + "Qty4") as HTMLInputElement;
      const aprIn = document.getElementById(id + "Apr") as HTMLInputElement;
      const mayIn = document.getElementById(id + "May") as HTMLInputElement;
      const junIn = document.getElementById(id + "Jun") as HTMLInputElement;
      const julIn = document.getElementById(id + "Jul") as HTMLInputElement;
      const augIn = document.getElementById(id + "Aug") as HTMLInputElement;
      const sepIn = document.getElementById(id + "Sep") as HTMLInputElement;
      const octIn = document.getElementById(id + "Oct") as HTMLInputElement;
      const novIn = document.getElementById(id + "Nov") as HTMLInputElement;
      const decIn = document.getElementById(id + "Dec") as HTMLInputElement;
      const janIn = document.getElementById(id + "Jan") as HTMLInputElement;
      const febIn = document.getElementById(id + "Feb") as HTMLInputElement;
      const marIn = document.getElementById(id + "Mar") as HTMLInputElement;
      if (
        aprIn &&
        mayIn &&
        junIn &&
        julIn &&
        augIn &&
        sepIn &&
        octIn &&
        novIn &&
        decIn &&
        janIn &&
        febIn &&
        marIn &&
        qty1In &&
        qty2In &&
        qty3In &&
        qty4In &&
        rate1In &&
        rate2In &&
        rate3In &&
        rate4In
      ) {
        aprIn.disabled = disable;
        rate1In.disabled = disable;
        rate2In.disabled = disable;
        rate3In.disabled = disable;
        rate4In.disabled = disable;
        mayIn.disabled = disable;
        junIn.disabled = disable;
        octIn.disabled = disable;
        novIn.disabled = disable;
        decIn.disabled = disable;
        julIn.disabled = disable;
        augIn.disabled = disable;
        sepIn.disabled = disable;
        janIn.disabled = disable;
        febIn.disabled = disable;
        marIn.disabled = disable;
        qty1In.disabled = disable;
        qty2In.disabled = disable;
        qty3In.disabled = disable;
        qty4In.disabled = disable;
      }
    });
  };
  const updateTotalQtyVals = (which: string, difference: number) => {
    setTotalQty((prev) => {
      const updatedTotal = { ...prev };
      updatedTotal[which as keyof typeof prev] += difference;
      updatedTotal["totalFY" as keyof typeof prev] += difference;
      return updatedTotal;
    });
  };
  const handleInputChange = (
    subCategoryId: number,
    month: string, // e.g., "apr qty", "jul", "dec amount"
    value: string,
  ) => {
    setTableData((prev) => {
      const updatedData = { ...prev };
      const row = updatedData[subCategoryId];
      if (!row) return updatedData;

      const parts = month.split(" ");
      const baseMonth = parts[0] ?? "";
      const field = parts[1];

      const isNumericInput = !isNaN(Number(value.trim()));
      const parsedValue = isNumericInput ? Number(value.trim()) : 0;

      // 1️⃣ If plain month field (e.g. "jul"), update quarter total
      if (!field) {
        const oldVal = Number(row[baseMonth] ?? 0);
        const quarter = monthToQuarter[baseMonth];
        if (quarter !== undefined) {
          updateTotalQtyVals(quarter, parsedValue - oldVal);
        }
        row[baseMonth] = parsedValue;
      }

      // 2️⃣ If qty or rate is updated
      if (field === "qty" || field === "rate") {
        const qtyKey = `${baseMonth} qty`;
        const rateKey = `${baseMonth} rate`;
        const amtKey = `${baseMonth} amount`;

        const qty = field === "qty" ? parsedValue : Number(row[qtyKey] ?? 0);
        const rate = field === "rate" ? parsedValue : Number(row[rateKey] ?? 0);
        const amount = Number((qty * rate).toFixed(2));

        row[qtyKey] = qty;
        row[rateKey] = rate;
        row[amtKey] = amount;
        row[monthMap[baseMonth] ?? baseMonth] = amount; // Used for total calculation
      }

      // 3️⃣ Always update the raw input value
      if (field) {
        row[month] = parsedValue;
      }

      updatedData[subCategoryId] = row;
      return updatedData;
    });
  };

  const isReadOnlyField = (month: string) => {
    // Check if it's a month name only (Apr, May, etc.) or ends with "Amt"
    return !month.includes(" ") || month.endsWith("amount");
  };
  const handleSave = async () => {
    setSaveBtnState("loading");
    if (!filter?.map) throw new Error("Need to select the travel type");
    const userId = Number(userData.data?.user.id ?? 1);

    const budgetDetails = Object.entries(tableData).map(
      ([subCategoryId, data]) =>
        transformTableRowToBudgetDetail(
          subCategoryId,
          data as ReturnType<typeof getBaseStructure>,
          budgetId,
          categoryId,
          deptId,
          subdepartmentId,
          userId,
          filter?.id,
        ),
    );

    try {
      console.log(budgetDetails, "Travel budgetDetails");
      createBudgetDetails.mutate(
        {
          deptId: Number(deptId),
          budgetId: budgetId,
          catId: categoryId,
          data: budgetDetails as BudgetDetails[],
          subDeptId: subdepartmentId,
          travel_typeid: filter?.id,
        },
        {
          onSuccess: (data) =>
            handleSaveSuccess(
              data,
              setTableData,
              handelnputDisable,
              setSaveBtnState,
            ),
          onError: (error) => {
            setSaveBtnState("save");
            throw new Error(JSON.stringify(error));
          },
        },
      );
    } catch (error) {
      handleSaveError(error, setSaveBtnState);
    }
  };

  const handleUpdate = async () => {
    setSaveBtnState("loading");
    const userId = Number(userData.data?.user.id ?? 1);
    const updatedBudgetDetails = Object.entries(tableData).map(
      ([subCategoryId, data]) =>
        transformTableRowToUpdateBudgetDetail(
          subCategoryId,
          data as ReturnType<typeof getBaseStructure>,
          budgetId,
          categoryId,
          deptId,
          userId,
          subdepartmentId,
          filter?.id ?? 0,
        ),
    );
    try {
      console.log(updatedBudgetDetails, "travel updatedBudgetDetails");
      updateBudgetDetails.mutate(
        {
          data: updatedBudgetDetails as UpdateTravelBudgetDetails[],
        },
        {
          onSuccess: (data) => handleUpdateSuccess(data, handelnputDisable),
          onError: (error) => handleUpdateError(error, setSaveBtnState),
        },
      );
    } catch (error) {
      handleUpdateError(error, setSaveBtnState);
    } finally {
      setSaveBtnState("edit");
    }
  };
  function getDisplayName(name: string) {
    return displayNameMap[name] ?? name;
  }
  function getDisplayColumn(name: string) {
    return displayColumnMap[name] ?? name;
  }
  useEffect(() => {
    if (onTotalsChange) {
      onTotalsChange(totalQty);
    }
  }, [totalQty]);
  return (
    <div className="my-6 rounded-md bg-white shadow-lg">
      <details
        className={`group mx-auto w-full overflow-hidden rounded bg-[#F5F5F5] shadow transition-[max-height] duration-500`}
        open={sectionOpen == "Travel"}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <summary
          className="flex cursor-pointer items-center justify-between gap-32 rounded-md border border-primary bg-primary/10 p-2 text-primary outline-none"
          onClick={(e) => {
            e.preventDefault();
            if (sectionOpen == "Travel") setSectionOpen(null);
            else setSectionOpen("Travel");
          }}
        >
          <h1 className="text-md w-full text-center font-medium capitalize md:w-1/6 md:text-left">
            {section.toLowerCase()}
          </h1>
          {travelDataLodaing ? (
            <div className="flex items-center space-x-2">
              <p className="text-sm">Loading.....</p>
            </div>
          ) : (
            <div className="hidden md:flex w-5/6 items-center gap-20">
              <div className="w-1/6 rounded-md border border-primary/20 bg-primary/5 px-3 py-1">
                <span className="text-sm font-medium">Q1:</span>{" "}
                {totalQty.totalQ1.toLocaleString("hi-IN")}
              </div>
              <div className="w-1/6 rounded-md border border-primary/20 bg-primary/5 px-3 py-1">
                <span className="text-sm font-medium">Q2:</span>{" "}
                {totalQty.totalQ2.toLocaleString("hi-IN")}
              </div>
              <div className="w-1/6 rounded-md border border-primary/20 bg-primary/5 px-3 py-1">
                <span className="text-sm font-medium">Q3:</span>{" "}
                {totalQty.totalQ3.toLocaleString("hi-IN")}
              </div>
              <div className="w-1/6 rounded-md border border-primary/20 bg-primary/5 px-3 py-1">
                <span className="text-sm font-medium">Q4:</span>{" "}
                {totalQty.totalQ4.toLocaleString("hi-IN")}
              </div>
              <div className="w-1/6 rounded-md border border-primary/20 bg-primary/5 px-3 py-1">
                <span className="text-sm font-medium">FY:</span>{" "}
                {totalQty.totalFY.toLocaleString("hi-IN")}
              </div>
              <span className="text-lg font-bold transition-transform group-open:rotate-90">
                →
              </span>
            </div>
          )}
        </summary>

        <div className="flex justify-center gap-2">
          <div className="z-10 mt-3 w-1/4">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex w-full cursor-pointer items-center justify-between rounded-lg border py-1 pl-2 text-left text-sm font-normal text-gray-500">
                  <span className="capitalize">{filter?.name} </span>
                  <RiArrowDropDownLine size={30} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="max-h-56 !w-[280px] overflow-y-scroll rounded-lg bg-white p-2 shadow-lg">
                {subTravels.map((val, map) => (
                  <DropdownMenu.Item
                    key={map}
                    className="cursor-pointer rounded p-2 text-sm hover:bg-gray-100 focus:ring-0"
                    onSelect={() => handleSubCatSelect(val)}
                  >
                    {val.name}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
          <Marquee className="mr-2 w-3/4 border">
            {subTravels.map((t) => {
              if (t.name == "All") return;
              const activityData = travelData?.travelTypesTotal.find(
                (activity) => Number(activity.travelTypeId) == t.map,
              );
              return (
                <span key={t.map} className="text-medium mr-2">
                  <span className="font-semibold text-green-800">
                    {" "}
                    {t.name}
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
            {!travelDataLodaing && (
              <tbody>
                {travelData?.subCategories.map((sub) => {
                  if (sub.subCategoryName != "Staff Benefits")
                    return (
                      <tr
                        key={sub.subCategoryId}
                        className="text-sm transition hover:bg-gray-100"
                      >
                        <td className="border p-2 font-medium capitalize">
                          {getDisplayName(sub.subCategoryName)}
                        </td>
                        {months.map((month, key) => (
                          <td
                            key={month}
                            className="border p-2"
                            style={{ minWidth: "100px" }}
                          >
                            <input
                              disabled={inputStates || isReadOnlyField(month)}
                              id={sub.subCategoryId + month}
                              type={key % 6 == 0 ? "number" : "text"}
                              className={`w-full rounded border p-1 ${isReadOnlyField(month) ? "bg-gray-100" : ""}`}
                              value={
                                tableData[sub.subCategoryId]?.[month] ?? ""
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
                    );
                })}
              </tbody>
            )}
          </table>
        </div>
        {filter?.map != 0 &&
          subdepartmentId != 0 &&
          deptId != "0" &&
          (status != "draft" ||
            (userData.data?.user.role != 1 && status == "draft")) && (
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
                      Save
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
                  // disabled={isSaveDisabled()}
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
                  // disabled={isSaveDisabled()}
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

export default TravelBudget;

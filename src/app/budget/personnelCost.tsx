import React, { useState, useEffect } from "react";
import { Button } from "@radix-ui/themes";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import {
  PersonnelCostProps,
  TableData,
  qtySchema,
  totalschema,
  avgQtySchema,
} from "./types/personnelCost";
import { months, bandLevelMapping } from "./Constants/personnelCostConstants";
import {
  buildInitialState,
  applyBudgetResults,
  applyQuarterStats,
} from "./Service/personnelCostHelper";

const PersonnelCost: React.FC<PersonnelCostProps> = ({
  section,
  categoryId,
  deptId,
  budgetId,
  status,
  sectionOpen,
  setSectionOpen,
  travelCatId,
  subdepartmentId,
  financialYear,
  onTotalsChange,
}) => {
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
  const [inputStates, setInputStates] = useState<boolean>(true);
  const [hired, setHired] = useState<boolean | null>(true);
  const [tableData, setTableData] = useState<TableData>({});
  const userData = useSession();
  const { data: personnelCostData, isLoading: personnelCostDataLodaing } =
    api.get.getPersonalCatDetials.useQuery(
      {
        subdeptId: subdepartmentId,
        budgetId,
        catId: categoryId,
        deptId: Number(deptId),
        financialYear: financialYear,
        hired: hired ?? undefined,
      },
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: 0,
      },
    );
  console.log(personnelCostData, "personnelCostData");
  const handelnputDisable = (disable: boolean) => {
    const subcategoryIds = [];
    setInputStates(disable);
    for (const [subcategoryId] of Object.entries(tableData)) {
      subcategoryIds.push(subcategoryId);
    }
    subcategoryIds.forEach((id) => {
      const subCatData = tableData[id];
      const qty1Val = subCatData?.Qty1 ?? 0;
      const qty2Val = subCatData?.Qty2 ?? 0;
      const qty3Val = subCatData?.Qty3 ?? 0;
      const qty4Val = subCatData?.Qty4 ?? 0;
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
        qty4In
      ) {
        if (disable) {
          aprIn.disabled = disable;
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
        } else {
          qty1In.disabled = disable;
          qty2In.disabled = disable;
          qty3In.disabled = disable;
          qty4In.disabled = disable;
          if (qty1Val == 0) {
            aprIn.disabled = disable;
            mayIn.disabled = disable;
            junIn.disabled = disable;
          }
          if (qty2Val == 0) {
            julIn.disabled = disable;
            augIn.disabled = disable;
            sepIn.disabled = disable;
          }
          if (qty3Val == 0) {
            octIn.disabled = disable;
            novIn.disabled = disable;
            decIn.disabled = disable;
          }
          if (qty4Val == 0) {
            janIn.disabled = disable;
            febIn.disabled = disable;
            marIn.disabled = disable;
          }
        }
      } else {
        console.error(`Input element with ID  not found.`);
      }
    });
  };
  const [avgQty, setAvgQty] = useState<avgQtySchema>({});
  const isSaveDisabled = () => {
    return Object.values(tableData).some((subData) => {
      return months.some((month) => {
        return !subData[month]?.toString().trim();
      });
    });
  };

  useEffect(() => {
    if (
      personnelCostData?.budgetId == budgetId &&
      personnelCostData.subDeptId == subdepartmentId
    ) {
      if (personnelCostData?.subCategories) {
        const { initialData, initialAvgQty } = buildInitialState(
          personnelCostData.subCategories,
        );
        setAvgQty(initialAvgQty);
        setTableData(initialData);

        if (personnelCostData.result && personnelCostData.result.length > 0) {
          setSaveBtnState("edit");
          const {
            tableData: td,
            avgQty: aq,
            totals,
          } = applyBudgetResults(
            initialData,
            initialAvgQty,
            personnelCostData.result,
          );
          setAvgQty(aq);
          setTableData(td);
          setTotalQty(totals);
        } else if (personnelCostData.quarterStats) {
          setSaveBtnState("save");
          const {
            tableData: td,
            avgQty: aq,
            totals,
          } = applyQuarterStats(
            initialData,
            initialAvgQty,
            personnelCostData.subCategories,
            personnelCostData.quarterStats,
          );
          setAvgQty(aq);
          setTableData(td);
          setTotalQty(totals);
        }
      }
    }
  }, [personnelCostData]);
  const createBudgetDetails = api.post.savePersonalBudgetDetails.useMutation();
  const handleSave = async () => {
    setSaveBtnState("loading");
    const budgetDetails = Object.entries(tableData).map(
      ([subCategoryId, data]) => ({
        budgetid: budgetId,
        catid: categoryId,
        subcategoryId: parseInt(subCategoryId, 10),
        subDeptId: subdepartmentId,
        unit: 1,
        rate: "1",
        total: "1",
        currency: "INR",
        notes: "",
        description: "",
        april: (data.Apr ?? "0").toString(),
        may: (data.May ?? "0").toString(),
        june: (data.Jun ?? "0").toString(),
        july: (data.Jul ?? "0").toString(),
        august: (data.Aug ?? "0").toString(),
        september: (data.Sep ?? "0").toString(),
        october: (data.Oct ?? "0").toString(),
        november: (data.Nov ?? "0").toString(),
        december: (data.Dec ?? "0").toString(),
        january: (data.Jan ?? "0").toString(),
        february: (data.Feb ?? "0").toString(),
        march: (data.Mar ?? "0").toString(),
        activity: undefined,
        deptId: 9,
        createdBy: userData.data?.user.id ?? 1,
        createdAt: "2022-12-11",
        qty1: Number(data.Qty1),
        qty2: Number(data.Qty2),
        qty3: Number(data.Qty3),
        qty4: Number(data.Qty4),
      }),
    );
    try {
      createBudgetDetails.mutate(
        {
          deptId: Number(deptId),
          budgetId: budgetId,
          catId: categoryId,
          data: budgetDetails,
          travelCatId,
          subDeptId: subdepartmentId,
        },
        {
          onSuccess: (data) => {
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
            setTableData((prev) => {
              const updatedData = { ...prev };
              data.data.map((item) => {
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
          },
          onError: (error) => {
            setSaveBtnState("save");
            throw new Error(JSON.stringify(error));
            console.error("Error creating budget:", error);
          },
        },
      );
    } catch (error) {
      console.error("Failed to save budget details:", error);
      toast.warn("Error While saving ", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
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
    month: string,
    value: string,
  ) => {
    setTableData((prev) => {
      const updatedData = { ...prev };
      const subCategoryData = updatedData[subCategoryId];
      if (!subCategoryData || !avgQty[subCategoryId]) return updatedData;
      if (month == "Apr" || month == "May" || month == "Jun") {
        const diff = Number(value) - Number(subCategoryData[month]);
        updateTotalQtyVals("totalQ1", diff);

        // Update Q1 total for this subcategory
        const apr = Number(subCategoryData.Apr ?? "0");
        const may = Number(subCategoryData.May ?? "0");
        const jun = Number(subCategoryData.Jun ?? "0");

        // Update the value being changed
        if (month === "Apr") {
          subCategoryData.Q1 = (Number(value) + may + jun).toString();
        } else if (month === "May") {
          subCategoryData.Q1 = (apr + Number(value) + jun).toString();
        } else if (month === "Jun") {
          subCategoryData.Q1 = (apr + may + Number(value)).toString();
        }
      }
      if (month == "Jul" || month == "Aug" || month == "Sep") {
        const diff = Number(value) - Number(subCategoryData[month]);

        updateTotalQtyVals("totalQ2", diff);

        // Update Q2 total for this subcategory
        const jul = Number(subCategoryData.Jul ?? "0");
        const aug = Number(subCategoryData.Aug ?? "0");
        const sep = Number(subCategoryData.Sep ?? "0");

        // Update the value being changed
        if (month === "Jul") {
          subCategoryData.Q2 = (Number(value) + aug + sep).toString();
        } else if (month === "Aug") {
          subCategoryData.Q2 = (jul + Number(value) + sep).toString();
        } else if (month === "Sep") {
          subCategoryData.Q2 = (jul + aug + Number(value)).toString();
        } else if (month === "Aug") {
          subCategoryData.Q2 = (jul + Number(value) + sep).toString();
        } else if (month === "Sep") {
          subCategoryData.Q2 = (jul + aug + Number(value)).toString();
        } else if (month === "Aug") {
          subCategoryData.Q2 = (jul + Number(value) + sep).toString();
        } else if (month === "Sep") {
          subCategoryData.Q2 = (jul + aug + Number(value)).toString();
        }
      }
      if (month == "Oct" || month == "Nov" || month == "Dec") {
        const diff = Number(value) - Number(subCategoryData[month]);
        updateTotalQtyVals("totalQ3", diff);

        // Update Q3 total for this subcategory
        const oct = Number(subCategoryData.Oct ?? "0");
        const nov = Number(subCategoryData.Nov ?? "0");
        const dec = Number(subCategoryData.Dec ?? "0");

        // Update the value being changed
        if (month === "Oct") {
          subCategoryData.Q3 = (Number(value) + nov + dec).toString();
        } else if (month === "Nov") {
          subCategoryData.Q3 = (oct + Number(value) + dec).toString();
        } else if (month === "Dec") {
          subCategoryData.Q3 = (oct + nov + Number(value)).toString();
        }
      }
      if (month == "Jan" || month == "Feb" || month == "Mar") {
        const diff = Number(value) - Number(subCategoryData[month]);
        updateTotalQtyVals("totalQ4", diff);

        // Update Q4 total for this subcategory
        const jan = Number(subCategoryData.Jan ?? "0");
        const feb = Number(subCategoryData.Feb ?? "0");
        const mar = Number(subCategoryData.Mar ?? "0");

        // Update the value being changed
        if (month === "Jan") {
          subCategoryData.Q4 = (Number(value) + feb + mar).toString();
        } else if (month === "Feb") {
          subCategoryData.Q4 = (jan + Number(value) + mar).toString();
        } else if (month === "Mar") {
          subCategoryData.Q4 = (jan + feb + Number(value)).toString();
        }
      }
      if (
        month === "Qty1" ||
        month === "Qty2" ||
        month === "Qty3" ||
        month === "Qty4"
      ) {
        const qty = parseInt(value, 10) || 0;

        if (month === "Qty1") {
          const aprDiff =
            qty * avgQty[subCategoryId].Apr - Number(subCategoryData.Apr);
          const mayDiff =
            qty * avgQty[subCategoryId].May - Number(subCategoryData.May);
          const jubDiff =
            qty * avgQty[subCategoryId].Jun - Number(subCategoryData.Jun);
          updateTotalQtyVals("totalQ1", aprDiff);
          updateTotalQtyVals("totalQ1", mayDiff);
          updateTotalQtyVals("totalQ1", jubDiff);
          subCategoryData.Apr = Math.ceil(qty * avgQty[subCategoryId].Apr);
          subCategoryData.May = Math.ceil(qty * avgQty[subCategoryId].May);
          subCategoryData.Jun = Math.ceil(qty * avgQty[subCategoryId].Jun);

          // Update Q1 value based on the new Apr, May, Jun values
          const q1Value =
            Number(subCategoryData.Apr) +
            Number(subCategoryData.May) +
            Number(subCategoryData.Jun);
          subCategoryData.Q1 = q1Value.toString();
        }
        if (month === "Qty2") {
          const julDiff =
            qty * avgQty[subCategoryId].Jul - Number(subCategoryData.Jul);
          const augDiff =
            qty * avgQty[subCategoryId].Aug - Number(subCategoryData.Aug);
          const sepDiff =
            qty * avgQty[subCategoryId].Sep - Number(subCategoryData.Sep);
          updateTotalQtyVals("totalQ2", julDiff);
          updateTotalQtyVals("totalQ2", augDiff);
          updateTotalQtyVals("totalQ2", sepDiff);
          subCategoryData.Jul = Math.ceil(qty * avgQty[subCategoryId].Jul);
          subCategoryData.Aug = Math.ceil(qty * avgQty[subCategoryId].Aug);
          subCategoryData.Sep = Math.ceil(qty * avgQty[subCategoryId].Sep);
        }
        if (month === "Qty3") {
          const julDiff =
            qty * avgQty[subCategoryId].Oct - Number(subCategoryData.Oct);
          const augDiff =
            qty * avgQty[subCategoryId].Nov - Number(subCategoryData.Nov);
          const sepDiff =
            qty * avgQty[subCategoryId].Dec - Number(subCategoryData.Dec);
          updateTotalQtyVals("totalQ3", julDiff);
          updateTotalQtyVals("totalQ3", augDiff);
          updateTotalQtyVals("totalQ3", sepDiff);
          subCategoryData.Oct = Math.ceil(qty * avgQty[subCategoryId].Oct);
          subCategoryData.Nov = Math.ceil(qty * avgQty[subCategoryId].Nov);
          subCategoryData.Dec = Math.ceil(qty * avgQty[subCategoryId].Dec);
        }
        if (month === "Qty4") {
          const julDiff =
            qty * avgQty[subCategoryId].Jan - Number(subCategoryData.Jan);
          const augDiff =
            qty * avgQty[subCategoryId].Feb - Number(subCategoryData.Feb);
          const sepDiff =
            qty * avgQty[subCategoryId].Mar - Number(subCategoryData.Mar);
          updateTotalQtyVals("totalQ4", julDiff);
          updateTotalQtyVals("totalQ4", augDiff);
          updateTotalQtyVals("totalQ4", sepDiff);
          subCategoryData.Jan = Math.ceil(qty * avgQty[subCategoryId].Jan);
          subCategoryData.Feb = Math.ceil(qty * avgQty[subCategoryId].Feb);
          subCategoryData.Mar = Math.ceil(qty * avgQty[subCategoryId].Mar);
        }
        subCategoryData.Count = qty;
      }
      subCategoryData[month] = value;
      updatedData[subCategoryId] = subCategoryData;

      return updatedData;
    });
  };

  const updateBudgetDetails =
    api.post.updatePersonalBudgetDetails.useMutation();
  const handleUpdate = async () => {
    setSaveBtnState("loading");
    const budgetDetails = Object.entries(tableData).map(
      ([subCategoryId, data]) => ({
        budgetDetailsId: data.budgetDetailsId,
        catid: categoryId,
        subcategoryId: parseInt(subCategoryId, 10),
        // need to be removed
        unit: 1,
        rate: "1",
        total: "1",
        currency: "INR",
        notes: "",
        description: "",
        april: (data.Apr ?? "0").toString(),
        may: (data.May ?? "0").toString(),
        june: (data.Jun ?? "0").toString(),
        july: (data.Jul ?? "0").toString(),
        august: (data.Aug ?? "0").toString(),
        september: (data.Sep ?? "0").toString(),
        october: (data.Oct ?? "0").toString(),
        november: (data.Nov ?? "0").toString(),
        december: (data.Dec ?? "0").toString(),
        january: (data.Jan ?? "0").toString(),
        february: (data.Feb ?? "0").toString(),
        march: (data.Mar ?? "0").toString(),
        updatedBy: userData.data?.user.id ?? 1,
        updatedAt: new Date().toISOString(),
        rate1: (data.rate1 ?? "0").toString(),
        rate2: (data.rate2 ?? "0").toString(),
        rate3: (data.rate3 ?? "0").toString(),
        rate4: (data.rate4 ?? "0").toString(),
        amount1: (data.amount1 ?? "0").toString(),
        amount2: (data.amount2 ?? "0").toString(),
        amount3: (data.amount3 ?? "0").toString(),
        amount4: (data.amount4 ?? "0").toString(),
        qty1: Number(data.Qty1),
        qty2: Number(data.Qty2),
        qty3: Number(data.Qty3),
        qty4: Number(data.Qty4),
      }),
    );
    try {
      updateBudgetDetails.mutate(
        {
          deptId: parseInt(deptId, 10),
          budgetId,
          catId: categoryId,
          data: budgetDetails,
          travelCatId,
          subDeptId: subdepartmentId,
        },
        {
          onSuccess: (data) => {
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
          },
          onError: (error) => {
            throw new Error(JSON.stringify(error));
            console.error("Error updating budget:", error);
          },
        },
      );
    } catch (error) {
      console.error("Failed to update budget details:", error);
      toast.warn("Error While saving ", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setSaveBtnState("edit");
    }
  };

  // right after your setTotalQty(totalQtyAfterSomething)
  useEffect(() => {
    if (onTotalsChange) {
      onTotalsChange(totalQty);
    }
  }, [totalQty]);

  return (
    <div className="my-6 rounded-md bg-white shadow-lg">
      <details
        className="group mx-auto w-full overflow-hidden rounded bg-[#F5F5F5] shadow transition-[max-height] duration-500"
        open={sectionOpen == "PERSONNEL"}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        
        <summary
          className="flex flex-wrap items-center gap-3 rounded-md border border-primary/20 bg-primary/10 p-2 font-medium text-primary transition-all hover:cursor-pointer hover:border-primary/40 hover:shadow-sm md:grid md:grid-cols-[0.68fr_100px_repeat(5,1fr)_min-content]"
          onClick={(e) => { 
            const target = e.target as HTMLElement;
            if (target.closest('[data-hired-filter="true"]')) {
              e.stopPropagation();
              return;
            }
            e.preventDefault();
            setSectionOpen(sectionOpen === "PERSONNEL" ? null : "PERSONNEL");
          }}
        >
          {[
            <h1 key="section" className="text-md whitespace-nowrap capitalize">
              {section.toLowerCase()}
            </h1>,

            // Dropdown next to section title
            <select
              key="hired-filter"
              value={hired === null ? "ALL" : hired ? "Hired" : "TBH"}
              onChange={(event) => {
                const value = event.target.value;
                if (value === "Hired") setHired(true);
                else if (value === "TBH") setHired(false);
                else setHired(null);
              }}
              data-hired-filter="true"
              onClick={(e) => e.stopPropagation()}
              className="rounded-md border border-primary bg-white px-3 py-1 text-sm font-medium text-primary shadow-sm outline-none transition focus:border-primary md:ml-0"
            >
              <option value="ALL" className="border-b border-primary py-1">
                All
              </option>
              <option value="Hired" className="border-b border-primary py-1">
                Hired
              </option>
              <option value="TBH" className="border-b border-primary py-1">
                TBH
              </option>
            </select>,

            ...(["Q1", "Q2", "Q3", "Q4", "Total"] as const).map((label) => (
              <div
                key={label}
                className="hidden w-full flex-col items-center rounded-md border border-primary/20 bg-primary/5 px-3 py-1 text-center md:flex xl:flex-row xl:justify-center xl:gap-1"
              >
                <span className="text-sm font-medium">{label}:</span>{" "}
                <span className="overflow-hidden text-ellipsis">
                  {(label === "Total"
                    ? totalQty.totalFY
                    : totalQty[`total${label}` as keyof typeof totalQty]
                  ).toLocaleString("hi-IN")}
                </span>
              </div>
            )),

            <span
              key="arrow"
              className="self-center justify-self-end text-lg font-bold transition-transform"
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
                <th className="border p-2 capitalize">Level</th>
                {months.map((month) => {
                  if (month == "Qty1")
                    return (
                      <th
                        key={month}
                        className="sticky top-0 z-40 border bg-gray-200 p-2 capitalize"
                        style={{ minWidth: "80px" }}
                      >
                        #Qty1
                      </th>
                    );
                  else if (month == "Qty2")
                    return (
                      <th
                        key={month}
                        className="sticky top-0 z-40 border bg-gray-200 p-2 capitalize"
                        style={{ minWidth: "80px" }}
                      >
                        #Qty2
                      </th>
                    );
                  else if (month == "Qty3")
                    return (
                      <th
                        key={month}
                        className="sticky top-0 z-40 border bg-gray-200 p-2 capitalize"
                        style={{ minWidth: "80px" }}
                      >
                        #Qty3
                      </th>
                    );
                  else if (month == "Qty4")
                    return (
                      <th
                        key={month}
                        className="sticky top-0 z-40 border bg-gray-200 p-2 capitalize"
                        style={{ minWidth: "80px" }}
                      >
                        #Qty4
                      </th>
                    );
                  else if (
                    month == "Q1" ||
                    month == "Q2" ||
                    month == "Q3" ||
                    month == "Q4"
                  ) {
                    const quarterMap = {
                      Q1: "q1 total",
                      Q2: "q2 total",
                      Q3: "q3 total",
                      Q4: "q4 total",
                      Total: "Total",
                    };
                    return (
                      <th
                        key={month}
                        className="sticky top-0 z-40 border bg-gray-200 p-2 font-medium capitalize"
                        style={{ minWidth: "90px" }}
                      >
                        {quarterMap[month]}
                      </th>
                    );
                  } else
                    return (
                      <th
                        key={month}
                        className="sticky top-0 z-40 border bg-gray-200 p-2 capitalize"
                      >
                        {month.toLowerCase()}
                      </th>
                    );
                })}
              </tr>
            </thead>
            <tbody>
              {personnelCostData?.subCategories
                ?.sort((a, b) => a.subCategoryId - b.subCategoryId)
                .map((sub) => (
                  <tr
                    key={sub.subCategoryId}
                    className="text-sm transition hover:bg-gray-100"
                  >
                    {/* <td className="border p-2 font-medium capitalize">{sub.subCategoryName.toUpperCase()}</td> */}
                    <td className="sticky left-0 z-10 border bg-white p-2 font-medium capitalize">
                      {["I", "II", "III", "IV", "V", "VI", "VII"].includes(
                        sub.subCategoryName,
                      )
                        ? `${bandLevelMapping[sub.subCategoryName]} - ${sub.subCategoryName.toUpperCase()}`
                        : `${sub.subCategoryName.toUpperCase()} - ${bandLevelMapping[sub.subCategoryName] ?? "default"}`}
                    </td>
                    {months.map((month, idx) => {
                      const isTotalCol =
                        month === "Q1" ||
                        month === "Q2" ||
                        month === "Q3" ||
                        month === "Q4" ||
                        month === "Total";
                      return (
                        <td key={month} className="border p-2">
                          <input
                            type={idx % 4 === 0 ? "number" : "text"}
                            className={`w-full rounded border p-1 ${
                              isTotalCol
                                ? "bg-blue-50 font-medium text-blue-700"
                                : ""
                            }`}
                            disabled={true}
                            // disabled={(idx % 4 !== 0 )|| (userData.data?.user.role == 1 && status == "draft") || (userData.data?.user.role == 2 && status != "draft")}
                            value={tableData[sub.subCategoryId]?.[month] ?? ""}
                            id={sub.subCategoryId + month}
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
              {/* Total Row */}
              <tr className="bg-gray-100 text-sm transition">
                <td className="border p-2 font-medium capitalize">TOTAL</td>
                {months.map((month) => {
                  // Calculate the sum for each column
                  // For Qty columns, exclude "Staff Benefits" subcategory
                  const isQtyColumn = ["Qty1", "Qty2", "Qty3", "Qty4"].includes(
                    month,
                  );

                  const sum = personnelCostData?.subCategories?.reduce(
                    (total, sub) => {
                      // Skip Staff Benefits subcategory for Qty columns
                      if (
                        isQtyColumn &&
                        sub.subCategoryName === "Staff Benefits"
                      ) {
                        return total;
                      }
                      const value = tableData[sub.subCategoryId]?.[month];
                      return total + (isNaN(Number(value)) ? 0 : Number(value));
                    },
                    0,
                  );
                  // Special rendering for quarterly columns (Q1, Q2, Q3, Q4) in the total row
                  if (
                    month === "Q1" ||
                    month === "Q2" ||
                    month === "Q3" ||
                    month === "Q4" ||
                    month === "Total"
                  ) {
                    return (
                      <td key={month} className="border bg-blue-50 p-2">
                        <div className="w-full rounded border bg-blue-50 p-1 font-medium text-blue-700">
                          {sum?.toLocaleString("hi-IN") ?? "0"}
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td key={month} className="border p-2">
                      <div className="w-full rounded border p-1">
                        {sum?.toLocaleString("hi-IN") ?? "0"}
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
        {(deptId == "5" ||
          deptId == "7" ||
          deptId == "4" ||
          deptId == "8" ||
          deptId == "6" ||
          (subdepartmentId != 0 && deptId != "0")) &&
          ((userData.data?.user.role == 1 && status != "draft") ||
            (userData.data?.user.role != 1 &&
              userData.data?.user.role != 3 &&
              status == "draft")) && (
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

export default PersonnelCost;

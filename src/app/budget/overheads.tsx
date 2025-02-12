"use client";

import { Button } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { toast } from 'react-toastify';

interface OverHeadsProps {
  section: string;
  categoryId: number;
  budgetId: number;
  deptId: string;
  status: string | undefined
  sectionOpen: null | "PERSONNEL" | "Program Activities" | "Travel" | "PROGRAM OFFICE" | "CAPITAL COST" | "OVERHEADS"
  setSectionOpen: (val: null | "PERSONNEL" | "Program Activities" | "Travel" | "PROGRAM OFFICE" | "CAPITAL COST" | "OVERHEADS") => void
  subdepartmentId: number
}

interface LevelData {
  budgetDetailsId: number
  Count: string | number;
  [month: string]: string | number;
}
interface totalschema {
  totalFY:number
  totalQ1: number
  totalQ2: number
  totalQ3: number
  totalQ4: number
}
type TableData = Record<string, LevelData>;


const months = [
  "Qty1", "Rate1", "Amount1", "Apr", "May", "Jun", "Qty2", "Rate2", "Amount2", "Jul", "Aug", "Sep", "Qty3", "Rate3", "Amount3", "Oct", "Nov", "Dec", "Qty4", "Rate4", "Amount4", "Jan", "Feb", "Mar",
];

const OverHeads: React.FC<OverHeadsProps> = ({ section, categoryId, budgetId, deptId ,status,sectionOpen,setSectionOpen,subdepartmentId}) => {
  const [saveBtnState, setSaveBtnState] = useState<"loading" | "edit" | "save">("loading")
  const userData = useSession()
  const [inputStates, setInputStates] = useState<boolean>(true)
  const [totalQty, setTotalQty] = useState<totalschema>({
    totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0,totalFY:0
  })
  const [tableData, setTableData] = useState<TableData>({});

  // api calls
  const { data: overHeadData, isLoading: overHeadDataLodaing } = api.get.getOverHeadsData.useQuery({
    budgetId,
    catId: categoryId,
    deptId: Number(deptId),
    subDeptId: subdepartmentId
  }, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
  })
  const createBudgetDetails = api.post.addBudgetDetails.useMutation();
  const updateBudgetDetails = api.post.updateBudgetDetails.useMutation();

  // use effect hook
  useEffect(() => {
    if (overHeadData?.budgetId == budgetId && overHeadData.subDeptId == subdepartmentId) {
      const initialData: TableData = {};
      if (overHeadData?.subCategories) {
        const totalQtyAfterBudgetDetails: totalschema = { totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0,totalFY:0 }
        setTotalQty(totalQtyAfterBudgetDetails)
        overHeadData.subCategories.forEach((sub) => {
          initialData[sub.subCategoryId] = {
            Count: "",
            Qty1: 0,
            Rate1: "0",
            Amount1: "0",
            Qty2: 0,
            Rate2: "0",
            Amount2: "0",
            Qty3: 0,
            Rate3: "0",
            Amount3: "0",
            Qty4: "0",
            Rate4: "0",
            Amount4: "0",
            Apr: "0",
            May: "0",
            Jun: "0",
            Jul: "0",
            Aug: "0",
            Sep: "0",
            Oct: "0",
            Nov: "0",
            Dec: "0",
            Jan: "0",
            Feb: "0",
            Mar: "0",
            budgetDetailsId: 0,
          };
        });
        setTableData(initialData);
      }
      if (overHeadData.result.length > 0 && overHeadData.subCategories.length > 0) {
        setSaveBtnState("edit")
        const totalQtyAfterBudgetDetails: totalschema = { totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0,totalFY:0 }
        overHeadData.result.forEach((item) => {
          initialData[item.subcategoryId] = {
            Count: Number(item.total),
            Apr: Number(item.april) ?? "0",
            May: Number(item.may) ?? "0",
            Jun: Number(item.june) ?? "0",
            Jul: Number(item.july) ?? "0",
            Aug: Number(item.august) ?? "0",
            Sep: Number(item.september) ?? "0",
            Oct: Number(item.october) ?? "0",
            Nov: Number(item.november) ?? "0",
            Dec: Number(item.december) ?? "0",
            Jan: Number(item.january) ?? "0",
            Feb: Number(item.february) ?? "0",
            Mar: Number(item.march) ?? "0",
            Qty1: item.qty1 ? Number(Number(item.qty1)) : "0",
            Rate1: item.rate1 ? Number(item.rate1) : "0",
            Amount1: item.amount1 ? Number(item.amount1) : "0",
            Qty2: item.qty2 ? Number(item.qty2) : "0",
            Rate2: item.rate2 ? Number(item.rate2) : "0",
            Amount2: item.amount2 ? Number(item.amount2) : "0",
            Qty3: item.qty3 ? Number(Number(item.qty3)) : "0",
            Rate3: item.rate3 ? Number(item.rate3) : "0",
            Amount3: item.amount3 ? Number(item.amount3) : "0",
            Qty4: item.qty4 ? Number(Number(item.qty4)) : "0",
            Rate4: item.rate4 ? Number(item.rate4) : "0",
            Amount4: item.amount4 ? Number(item.amount4) : "0",
            budgetDetailsId: Number(item.id),
          };
          totalQtyAfterBudgetDetails.totalFY += Number(item.january) + Number(item.february) + Number(item.march) + Number(item.april) + Number(item.may) + Number(item.june) + Number(item.july) + Number(item.august) + Number(item.september) + Number(item.october) + Number(item.november) + Number(item.december)
          totalQtyAfterBudgetDetails.totalQ1 += Number(item.april) + Number(item.may) + Number(item.june)
          totalQtyAfterBudgetDetails.totalQ2 += Number(item.july) + Number(item.august) + Number(item.september)
          totalQtyAfterBudgetDetails.totalQ3 += Number(item.october) + Number(item.november) + Number(item.december)
          totalQtyAfterBudgetDetails.totalQ4 += Number(item.january) + Number(item.february) + Number(item.march)
        });
        setTableData(initialData);
        setTotalQty(totalQtyAfterBudgetDetails)
      }
      else {
        setSaveBtnState("save")
      }
    }
  }, [overHeadData])

  // other functions
  const updateTotalQtyVals = (which: string, difference: number) => {
    setTotalQty((prev) => {
      const updatedTotal = { ...prev };
      updatedTotal[which as keyof typeof prev] += difference;
      updatedTotal["totalFY" as keyof typeof prev]+=difference
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
      if (!subCategoryData) return updatedData;
      if (month == "Apr" || month == "May" || month == "Jun") {
        const diff = Number(value) - Number(subCategoryData[month])
        updateTotalQtyVals("totalQ1", diff)
      }
      if (month == "Jul" || month == "Aug" || month == "Sep") {
        const diff = Number(value) - Number(subCategoryData[month])
        updateTotalQtyVals("totalQ2", diff)
      }
      if (month == "Oct" || month == "Nov" || month == "Dec") {
        const diff = Number(value) - Number(subCategoryData[month])
        updateTotalQtyVals("totalQ3", diff)
      }
      if (month == "Jan" || month == "Feb" || month == "Mar") {
        const diff = Number(value) - Number(subCategoryData[month])
        updateTotalQtyVals("totalQ4", diff)
      }
      if (month === "Rate1") {
        subCategoryData.Amount1 = (Number(subCategoryData.Qty1) * Number(value)).toFixed(2)
      }
      else if (month === "Qty1") {
        subCategoryData.Amount1 = (Number(subCategoryData.Rate1) * Number(value)).toFixed(2)
      }
      else if (month === "Rate2") {
        subCategoryData.Amount1 = (Number(subCategoryData.Qty2) * Number(value)).toFixed(2)
      }
      else if (month === "Qty2") {
        subCategoryData.Amount1 = (Number(subCategoryData.Rate2) * Number(value)).toFixed(2)
      } else if (month === "Rate3") {
        subCategoryData.Amount1 = (Number(subCategoryData.Qty3) * Number(value)).toFixed(2)
      }
      else if (month === "Qty3") {
        subCategoryData.Amount1 = (Number(subCategoryData.Rate3) * Number(value)).toFixed(2)
      } else if (month === "Rate4") {
        subCategoryData.Amount1 = (Number(subCategoryData.Qty4) * Number(value)).toFixed(2)
      }
      else if (month === "Qt4") {
        subCategoryData.Amount1 = (Number(subCategoryData.Rate4) * Number(value)).toFixed(2)
      }
      subCategoryData[month] = value;
      updatedData[subCategoryId] = subCategoryData;
      return updatedData
    });
  };
  const isSaveDisabled = () => {
    return Object.values(tableData).some((subData) => {
      return months.some((month) => {
        return !subData[month]?.toString().trim(); // Checks if any month is empty
      });
    });
  };
  const handelnputDisable = (disable: boolean) => {
    const subcategoryIds = []
    setInputStates(disable)
    for (const [subcategoryId] of Object.entries(tableData)) {
      subcategoryIds.push(subcategoryId)
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
      if (aprIn && mayIn && junIn && julIn && augIn && sepIn && octIn && novIn && decIn && janIn && febIn && marIn) {
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
        rate1In.disabled = disable;
        rate2In.disabled = disable;
        rate3In.disabled = disable;
        rate4In.disabled = disable;
        qty1In.disabled = disable;
        qty2In.disabled = disable;
        qty3In.disabled = disable;
        qty4In.disabled = disable;
      } else {
        console.error(`Input element with ID  not found.`);
      }
    })
  }
  const handleSave = async () => {
    setSaveBtnState("loading")
    const budgetDetails = Object.entries(tableData).map(([subCategoryId, data]) => ({
      budgetid: budgetId,
      catid: categoryId,
      subcategoryId: parseInt(subCategoryId, 10),
      unit: 1,
      rate: "1",
      total: "1",
      currency: "INR",
      notes: "",
      description: "",
      april: (data.Apr ?? "").toString(),
      may: (data.May ?? "").toString(),
      june: (data.Jun ?? "").toString(),
      july: (data.Jul ?? "").toString(),
      august: (data.Aug ?? "").toString(),
      september: (data.Sep ?? "").toString(),
      october: (data.Oct ?? "").toString(),
      november: (data.Nov ?? "").toString(),
      december: (data.Dec ?? "").toString(),
      january: (data.Jan ?? "").toString(),
      february: (data.Feb ?? "").toString(),
      march: (data.Mar ?? "").toString(),
      rate1: (data.Rate1 ?? "").toString(),
      rate2: (data.Rate2 ?? "").toString(),
      rate3: (data.Rate3 ?? "").toString(),
      rate4: (data.Rate4 ?? "").toString(),
      amount1: ((data.Amount1 ?? "").toString()),
      amount2: ((data.Amount2 ?? "").toString()),
      amount3: ((data.Amount3 ?? "").toString()),
      amount4: ((data.Amount4 ?? "").toString()),
      qty1: Number(data.Qty1),
      qty2: Number(data.Qty2),
      qty3: Number(data.Qty3),
      qty4: Number(data.Qty4),
      deptId: Number(deptId),
      createdBy: userData.data?.user.id ?? 1,
      createdAt: new Date().toISOString(),
    }));

    try {
      createBudgetDetails.mutate(
        {
          deptId: parseInt(deptId, 10),
          budgetId: budgetId,
          catId: categoryId,
          data: budgetDetails,
          subDeptId:subdepartmentId
        },
        {
          onSuccess: (data) => {
            toast.success('Successfully Saved', {
              position: "bottom-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setSaveBtnState("edit")
            handelnputDisable(true)
            setTableData((prev) => {
              const updatedData = { ...prev }
              data.data.map((item) => {
                const subCategoryData = updatedData[item.subcategoryId]
                if (subCategoryData) {
                  updatedData[item.subcategoryId] = {
                    ...subCategoryData,
                    budgetDetailsId: item.budgetDetailsId,
                  };
                }
              })
              return updatedData
            })
            console.log("Budget created successfully:", data);
          },
          onError: (error) => {
            throw new Error(JSON.stringify(error))
            console.error("Error creating budget:", error);
          },
        }
      );
    } catch (error) {
      toast.warn('Error While saving ', {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.error("Failed to save budget details:", error);
    }
  };
  const handleUpdate = async () => {
    setSaveBtnState("loading")
    const budgetDetails = Object.entries(tableData).map(([subCategoryId, data]) => ({
      budgetDetailsId: data.budgetDetailsId,
      subcategoryId: parseInt(subCategoryId, 10),
      unit: 1,
      rate: "1",
      total: "1",
      currency: "INR",
      notes: "",
      description: "",
      april: (data.Apr ?? "").toString(),
      may: (data.May ?? "").toString(),
      june: (data.Jun ?? "").toString(),
      july: (data.Jul ?? "").toString(),
      august: (data.Aug ?? "").toString(),
      september: (data.Sep ?? "").toString(),
      october: (data.Oct ?? "").toString(),
      november: (data.Nov ?? "").toString(),
      december: (data.Dec ?? "").toString(),
      january: (data.Jan ?? "").toString(),
      february: (data.Feb ?? "").toString(),
      march: (data.Mar ?? "").toString(),
      updatedBy: userData.data?.user.id ?? 1,
      updatedAt: new Date().toISOString(),
      rate1: (data.Rate1 ?? "").toString(),
      rate2: (data.Rate2 ?? "").toString(),
      rate3: (data.Rate3 ?? "").toString(),
      rate4: (data.Rate4 ?? "").toString(),
      amount1: ((data.Amount1 ?? "").toString()),
      amount2: ((data.Amount2 ?? "").toString()),
      amount3: ((data.Amount3 ?? "").toString()),
      amount4: ((data.Amount4 ?? "").toString()),
      qty1: Number(data.Qty1),
      qty2: Number(data.Qty2),
      qty3: Number(data.Qty3),
      qty4: Number(data.Qty4)
    }));
    try {
      updateBudgetDetails.mutate(
        {
          deptId: parseInt(deptId, 10),
          budgetId,
          catId: categoryId,
          data: budgetDetails,
        },
        {
          onSuccess: (data) => {
            toast.success('Successfully Saved', {
              position: "bottom-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            handelnputDisable(true)
            console.log("Budget updated successfully:", data);
          },
          onError: (error) => {
            throw new Error(JSON.stringify(error))
            console.error("Error updating budget:", error);
          },
        }
      );
    } catch (error) {
      console.error("Failed to update budget details:", error);
      toast.warn('Error While saving ', {
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
    finally {
      setSaveBtnState("edit")
    }
  };
  return (
    <div className="my-6 rounded-md bg-white shadow-lg">
      {/* <ToastContainer /> */}
      <details
        className={`group mx-auto w-full overflow-hidden rounded bg-[#F5F5F5] shadow transition-[max-height] duration-500`}
        open={sectionOpen == "OVERHEADS"}
        onClick={(e) => {
          e.preventDefault()
        }}
      >
        <summary className="flex cursor-pointer items-center justify-between rounded-md border border-primary bg-primary/10 p-2 text-primary outline-none"
          onClick={(e) => {
            e.preventDefault()
            if (sectionOpen == "OVERHEADS")
              setSectionOpen(null)
            else
              setSectionOpen("OVERHEADS")
          }}>
          <h1 className=" capitalize font-medium">{section.toLowerCase()}</h1>
          {
            overHeadDataLodaing ? <div className="flex items-center space-x-2">
              <p className="text-sm">Loading.....</p>
            </div> :
              <div className="flex items-center space-x-2">
                <p className="text-md font-medium">FY: {totalQty.totalFY}, Q1: {totalQty.totalQ1}, Q2: {totalQty.totalQ2}, Q3: {totalQty.totalQ3}, Q4: {totalQty.totalQ4}</p>
                <span className="text-lg font-bold transition-transform group-open:rotate-90">→</span>
              </div>
          }
        </summary>

        <hr className="my-2 scale-x-150" />

        <div className="bg-gray-50 overflow-scroll">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left text-sm  text-gray-600">
                <th className="border p-2 capitalize">{"OVERHEADS".toLowerCase()}</th>
                {months.map((month) => (
                  <th key={month} className="border p-2 capitalize">{month.toLowerCase()}</th>
                ))}
              </tr>
            </thead>
            {
              !overHeadDataLodaing && <tbody>
                {overHeadData?.subCategories.map((sub) => (
                  <tr
                    key={sub.subCategoryId}
                    className="text-sm transition hover:bg-gray-100"
                  >
                    {/* Level Name */}
                    <td className="border p-2 font-medium capitalize">{sub.subCategoryName.toLowerCase()}</td>
                    {months.map((month,key) => (
                      <td key={month} className="border p-2">
                        <input
                          type={key % 6 == 0 ? "number" : "text"}
                          id={sub.subCategoryId + month}
                          disabled={true}
                          className="w-full rounded border p-1"
                          value={tableData[sub.subCategoryId]?.[month] ?? ""}
                          onChange={(e) =>
                            handleInputChange(sub.subCategoryId, month, e.target.value)
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
          ((userData.data?.user.role == 1 && status != "draft") || (userData.data?.user.role != 1 && status == "draft")) && <div className="py-2 pr-4 flex flex-row-reverse gap-2">
            {
              !inputStates && <div>
                {
                  saveBtnState == "loading" && <Button
                    type="button"
                    className=" !text-white !bg-primary px-2 !w-20 !text-lg border border-black !cursor-not-allowed"
                    variant="soft"
                  >
                    Loading...
                  </Button>
                }
                {
                  saveBtnState == "edit" && <Button
                    type="button"
                    className="cursor-pointer !text-white !bg-primary px-2 !w-20 !text-lg border border-black !disabled:cursor-not-allowed"
                    variant="soft"
                    style={{ cursor: isSaveDisabled() ? "not-allowed" : "pointer" }}
                    disabled={isSaveDisabled()}
                    onClick={() => handleUpdate()}
                  >
                    Edit
                  </Button>}
                {saveBtnState == "save" && <Button
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
              className="cursor-pointer !text-white !bg-primary px-2 !w-20 !text-lg border border-black !disabled:cursor-not-allowed "
              variant="soft"
              style={{ cursor: "pointer" }}
              // disabled={isSaveDisabled()}
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

export default OverHeads;

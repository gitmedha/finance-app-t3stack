"use client";

import { Button } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { ToastContainer, toast } from 'react-toastify';

interface OverHeadsProps {
  section: string;
  categoryId: number;
  budgetId: number;
  deptId: string;
  status: string | undefined
}

interface LevelData {
  budgetDetailsId: number
  Count: string | number;
  [month: string]: string | number;
}
interface totalschema {
  totalQ1: number
  totalQ2: number
  totalQ3: number
  totalQ4: number
}
type TableData = Record<string, LevelData>;


const months = [
  "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar",
];

const OverHeads: React.FC<OverHeadsProps> = ({ section, categoryId, budgetId, deptId ,status}) => {
  const [saveBtnState, setSaveBtnState] = useState<"loading" | "edit" | "save">("loading")
  
  const userData = useSession()
  const [inputStates, setInputStates] = useState<boolean>(true)

  const [totalQty, setTotalQty] = useState<totalschema>({
    totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0
  })
  // const { data, refetch } = api.get.getSubCats.useQuery({ categoryId });
  const [tableData, setTableData] = useState<TableData>({});
  
  const updateTotalQtyVals = (which: string, difference: number) => {
    setTotalQty((prev) => {
      const updatedTotal = { ...prev };
      updatedTotal[which as keyof typeof prev] += difference;
      console.log(updatedTotal)
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
        console.log(diff)
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
    for (const [subcategoryId, subcategoryData] of Object.entries(tableData)) {
      subcategoryIds.push(subcategoryId)
    }
    subcategoryIds.forEach((id) => {
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
      } else {
        console.error(`Input element with ID  not found.`);
      }
    })
  }
  // const { data: categoriesBudgetDetails, isLoading, error } = api.get.getCatsBudgetDetails.useQuery({
  //   budgetId,
  //   catId: categoryId,
  //   deptId: Number(deptId),
  // });
  const { data: overHeadData, isLoading:overHeadDataLodaing } = api.get.getOverHeadsData.useQuery({
    budgetId,
    catId: categoryId,
    deptId: Number(deptId),
  })
  useEffect(() => {
    if (overHeadData?.budgetId == budgetId) {
      const initialData: TableData = {};
      if (overHeadData?.subCategories) {
        const totalQtyAfterBudgetDetails: totalschema = { totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0 }
        setTotalQty(totalQtyAfterBudgetDetails)
        console.log("After getting the subcategories")
        overHeadData.subCategories.forEach((sub) => {
          initialData[sub.subCategoryId] = {
            Count: "",
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
        console.log("After getting the categorydetails")
        const totalQtyAfterBudgetDetails: totalschema = { totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0 }
        overHeadData.result.forEach((item) => {
          console.log(Number(item.april), Number(item.may), Number(item.june))
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
            budgetDetailsId: Number(item.id),
          };
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
  // useEffect(() => {
  //   const initialData: TableData = {};

  //   if (data?.subCategories) {
  //     data.subCategories.forEach((sub) => {
  //       initialData[sub.subCategoryId] = {
  //         Count: "",
  //         Apr: "0",
  //         May: "0",
  //         Jun: "0",
  //         Jul: "0",
  //         Aug: "0",
  //         Sep: "0",
  //         Oct: "0",
  //         Nov: "0",
  //         Dec: "0",
  //         Jan: "0",
  //         Feb: "0",
  //         Mar: "0",
  //         budgetDetailsId: 0,
  //       };
  //     });
  //   }
  //   if (categoriesBudgetDetails) {
  //     categoriesBudgetDetails.forEach((item) => {
  //       const totalQtyAfterBudgetDetails: totalschema = { totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0 }
  //       initialData[item.subcategoryId] = {
  //         Count: Number(item.total),
  //         Apr: Number(item.april) ?? "0",
  //         May: Number(item.may) ?? "0",
  //         Jun: Number(item.june) ?? "0",
  //         Jul: Number(item.july) ?? "0",
  //         Aug: Number(item.august )?? "0",
  //         Sep: Number(item.september) ?? "0",
  //         Oct: Number(item.october) ?? "0",
  //         Nov: Number(item.november) ?? "0",
  //         Dec: Number(item.december) ?? "0",
  //         Jan: Number(item.january) ?? "0",
  //         Feb: Number(item.february) ?? "0",
  //         Mar: Number(item.march) ?? "0",
  //         budgetDetailsId: Number(item.id),
  //       };
  //       totalQtyAfterBudgetDetails.totalQ1 += Number(item.april) + Number(item.may) + Number(item.june)
  //       totalQtyAfterBudgetDetails.totalQ2 += Number(item.july) + Number(item.august) + Number(item.september)
  //       totalQtyAfterBudgetDetails.totalQ3 += Number(item.october) + Number(item.november) + Number(item.december)
  //       totalQtyAfterBudgetDetails.totalQ4 += Number(item.january) + Number(item.february) + Number(item.march)
  //     });
  //     setTotalQty(totalQty)
  //   }

  //   setTableData(initialData);
  // }, [data, categoriesBudgetDetails]);
  const createBudgetDetails = api.post.addBudgetDetails.useMutation();
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
      activity: "",
      deptId: Number(deptId),
      clusterId: undefined,
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
  const updateBudgetDetails = api.post.updateBudgetDetails.useMutation();
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
      activity: "",
      clusterId: undefined,
      updatedBy: userData.data?.user.id ?? 1,
      updatedAt: new Date().toISOString(),
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
      <ToastContainer />
      <details
        className={`group mx-auto w-full overflow-hidden rounded bg-[#F5F5F5] shadow transition-[max-height] duration-500`}
      >
        <summary className="flex cursor-pointer items-center justify-between rounded-md border border-primary bg-primary/10 p-2 text-primary outline-none">
          <h1 className=" uppercase ">{section}</h1>
          {
            overHeadDataLodaing ? <div className="flex items-center space-x-2">
              <p className="text-sm">Loading.....</p>
            </div> :
              <div className="flex items-center space-x-2">
                <p className="text-sm">Total Cost: Q1:{totalQty.totalQ1} Q2:{totalQty.totalQ2} Q3:{totalQty.totalQ3} Q4:{totalQty.totalQ4}</p>
                <span className="text-lg font-bold transition-transform group-open:rotate-90">→</span>
              </div>
          }
        </summary>

        <hr className="my-2 scale-x-150" />

        <div className="bg-gray-50 overflow-scroll">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left text-sm uppercase text-gray-600">
                <th className="border p-2">OVERHEADS</th>
                {months.map((month) => (
                  <th key={month} className="border p-2">{month}</th>
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
                    <td className="border p-2 font-medium">{sub.subCategoryName}</td>
                    {months.map((month) => (
                      <td key={month} className="border p-2">
                        <input
                          type="text"
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
              className="cursor-pointer !text-primary  px-2 !w-20 !text-lg  border-primary border-2 !disabled:cursor-not-allowed"
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

"use client";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '@radix-ui/themes';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from "react";
// import { BiComment } from "react-icons/bi";
import { RiArrowDropDownLine } from 'react-icons/ri';
import { api } from '~/trpc/react';
import { toast } from 'react-toastify';
import Marquee from "react-fast-marquee";

interface ActivityBudgetProps {
  section: string;
  categoryId: number;
  budgetId: number;
  deptId: string;
  status: string | undefined
  sectionOpen: null | "PERSONNEL" | "Program Activities" | "Travel" | "PROGRAM OFFICE" | "CAPITAL COST" | "OVERHEADS"
  setSectionOpen: (val: null | "PERSONNEL" | "Program Activities" | "Travel" | "PROGRAM OFFICE" | "CAPITAL COST" | "OVERHEADS") => void
  subdepartmentId: number
  financialYear: string
}
interface totalschema {
  totalFY: number
  totalQ1: number
  totalQ2: number
  totalQ3: number
  totalQ4: number
}
interface subProgramActivitesSchema {
  map: number
  name: string
}
interface LevelData {
  budgetDetailsId: number
  Count: string | number;
  [month: string]: string | number;
}

type TableData = Record<string, LevelData>;

const subProgramActivites: subProgramActivitesSchema[] = [
  { map: 1, name: "Certificate Event" },
  { map: 2, name: "Faculty Workshop" },
  { map: 3, name: "Alumni Engagement" },
  { map: 4, name: "AI and Placement Drive" },
  { map: 5, name: "ITI Diagnostic" },
  { map: 6, name: "Divisional workshop" },
  { map: 7, name: "Divisional Industry workshop" },
  { map: 8, name: "MSDF Event" },
  { map: 9, name: "DSE Shoshin" },
  { map: 10, name: "Poly-Enrollment Drive" },
  { map: 11, name: "Poly-Placement12rive" },
  { map: 12, name: "Industry Engagement" },
  { map: 13, name: "TCPO Workshop" },
  { map: 14, name: "DSE Faculty workshop" },
  {map:15,name:"IT Subcriptions"},
  { map: 0, name: "All" }
]

const months = [
  "Qty1",
  "Rate1",
  "Amount1",
  "Apr",
  "May",
  "Jun",
  "Qty2",
  "Rate2",
  "Amount2",
  "Jul",
  "Aug",
  "Sep",
  "Qty3",
  "Rate3",
  "Amount3",
  "Oct",
  "Nov",
  "Dec",
  "Qty4",
  "Rate4",
  "Amount4",
  "Jan",
  "Feb",
  "Mar",
];

const ActivityBudget: React.FC<ActivityBudgetProps> = ({ section, categoryId, budgetId, deptId, status, sectionOpen, setSectionOpen, subdepartmentId, financialYear }) => {
  const userData = useSession()
  const [saveBtnState, setSaveBtnState] = useState<"loading" | "edit" | "save">("loading")
  const [inputStates, setInputStates] = useState<boolean>(true)
  const [totalQty, setTotalQty] = useState<totalschema>({
    totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0, totalFY: 0
  })
  const [filter, setFilter] = useState(subProgramActivites.sort((a, b) => a.name.localeCompare(b.name))[0])
  const [tableData, setTableData] = useState<TableData>({});

  // api calls
  const { data: programData, isLoading: programDataLodaing } = api.get.getProgramActivities.useQuery({
    budgetId,
    catId: categoryId,
    deptId: Number(deptId),
    activity: (filter?.map)?.toString(),
    subDeptId: subdepartmentId,
    financialYear
  }, {
    staleTime: 0
  })
  const createBudgetDetails = api.post.addBudgetDetails.useMutation();
  const updateBudgetDetails = api.post.updateBudgetDetails.useMutation();
  // useEffect hooks
  useEffect(() => {
    if (programData?.budgetId == budgetId && programData.subDeptId == subdepartmentId) {
      const initialData: TableData = {};
      if (programData?.subCategories) {
        const totalQtyAfterBudgetDetails: totalschema = { totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0, totalFY: 0 }
        setTotalQty(totalQtyAfterBudgetDetails)
        programData.subCategories.forEach((sub) => {
          initialData[sub.subCategoryId] = {
            Count: "",
            Qty1: 0,
            Rate1: "0",
            Amount1: "0",
            Apr: "0",
            May: "0",
            Jun: "0",
            Qty2: 0,
            Rate2: "0",
            Amount2: "0",
            Jul: "0",
            Aug: "0",
            Sep: "0",
            Qty3: 0,
            Rate3: "0",
            Amount3: "0",
            Oct: "0",
            Nov: "0",
            Dec: "0",
            Qty4: "0",
            Rate4: "0",
            Amount4: "0",
            Jan: "0",
            Feb: "0",
            Mar: "0",
            budgetDetailsId: 0
          };
        });
        setTableData(initialData);
        if (programData.result.length > 0 && programData.subCategories.length > 0) {
          setSaveBtnState("edit")
          const totalQtyAfterBudgetDetails: totalschema = { totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0, totalFY: 0 }
          programData.result.forEach((item) => {
            initialData[item.subcategoryId] = {
              Count: item.total ? Number(item.total) : 0,
              Apr: item.april ? Number(item.april) : "0",
              May: item.may ? Number(item.may) : "0",
              Jun: item.june ? Number(item.june) : "0",
              Jul: item.july ? Number(item.july) : "0",
              Aug: item.august ? Number(item.august) : "0",
              Sep: item.september ? Number(item.september) : "0",
              Oct: item.october ? Number(item.october) : "0",
              Nov: item.november ? Number(item.november) : "0",
              Dec: item.december ? Number(item.december) : "0",
              Jan: item.january ? Number(item.january) : "0",
              Feb: item.february ? Number(item.february) : "0",
              Mar: item.march ? Number(item.march) : "0",
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
              budgetDetailsId: item.id ? Number(Number(item.id)) : 0
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
    }
  }, [programData])
  useEffect(() => {
    handelnputDisable(true)
  }, [filter])

  // Other fuctions
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
      if (aprIn && mayIn && junIn && julIn && augIn && sepIn && octIn && novIn && decIn && janIn && febIn && marIn && rate1In && rate2In && rate3In && rate4In && qty1In && qty2In && qty3In && qty4In) {
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
      }
      // else {
      //   console.error(`Input element with ID  not found.`);
      //   console.log(aprIn, rate1In, rate2In, rate3In, qty1In, qty2In)
      // }
    })
  }
  const handleSelect = (val: subProgramActivitesSchema) => {
    setFilter(val)
  }
  const updateTotalQtyVals = (which: string, difference: number) => {
    setTotalQty((prev) => {
      const updatedTotal = { ...prev };
      updatedTotal[which as keyof typeof prev] += difference;
      updatedTotal["totalFY" as keyof typeof prev] += difference
      return updatedTotal;
    });
  };
  const isSaveDisabled = () => {
    return Object.values(tableData).some((subData) => {
      return months.some((month) => {
        return !subData[month]?.toString().trim();
      });
    });
  };
  const handleInputChange = (
    subCategoryId: number,
    month: string,
    value: string
  ) => {
    setTableData((prev) => {
      const updatedData = { ...prev };
      const subCategoryData = updatedData[subCategoryId];
      if (!subCategoryData) return prev;

      if (month == "Apr" || month == "May" || month == "Jun") {
        const diff = Number(value) - Number(subCategoryData[month]);
        updateTotalQtyVals("totalQ1", diff)
      }
      if (month == "Jul" || month == "Aug" || month == "Sep") {
        const diff = Number(value) - Number(subCategoryData[month]);
        updateTotalQtyVals("totalQ2", diff)
      }
      if (month == "Oct" || month == "Nov" || month == "Dec") {
        const diff = Number(value) - Number(subCategoryData[month]);
        updateTotalQtyVals("totalQ3", diff)
      }
      if (month == "Jan" || month == "Feb" || month == "Mar") {
        const diff = Number(value) - Number(subCategoryData[month]);
        updateTotalQtyVals("totalQ4", diff)
      }

      // Calculate Amount Updates
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

      return updatedData;
    });
  };
  const handleSave = async () => {
    setSaveBtnState("loading")
    const budgetDetails = Object.entries(tableData).map(([subCategoryId, data]) => ({
      budgetid: budgetId,
      catid: categoryId,
      subcategoryId: parseInt(subCategoryId, 10),
      // need to be removed
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
      activity: (filter?.map ?? "").toString(),
      deptId: Number(deptId),
      createdBy: userData.data?.user.id ?? 1,
      createdAt: new Date().toISOString(),
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
      createBudgetDetails.mutate(
        {
          deptId: Number(deptId),
          budgetId: budgetId,
          catId: categoryId,
          data: budgetDetails,
          subDeptId: subdepartmentId
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
            setSaveBtnState("edit")
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
            setSaveBtnState("save")
            throw new Error(JSON.stringify(error))
            console.error("Error creating budget:", error);
          },
        }
      );
    } catch (error) {
      console.error("Failed to save budget details:", error);
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
  };

  const handleUpdate = async () => {
    setSaveBtnState("loading")
    const budgetDetails = Object.entries(tableData).map(([subCategoryId, data]) => ({
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
      activity: (filter?.map ?? "").toString(),
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
      console.error("Failed to update budget details:", error);
    } finally {
      setSaveBtnState("edit")
    }
  };
  return (
    <div className="my-6 rounded-md bg-white shadow-lg">
      {/* {JSON.stringify(tableData)} */}
      {/* <ToastContainer/> */}
      <details
        className={`group mx-auto w-full overflow-hidden rounded bg-[#F5F5F5] shadow transition-[max-height] duration-500`}
        open={sectionOpen == "Program Activities"}
        onClick={(e) => {
          e.preventDefault()
        }}
      >
        <summary className="flex cursor-pointer items-center justify-between rounded-md border border-primary bg-primary/10 p-2 text-primary outline-none"
          onClick={(e) => {
            e.preventDefault()
            if (sectionOpen == "Program Activities")
              setSectionOpen(null)
            else
              setSectionOpen("Program Activities")
          }}>
          <h1 className=" capitalize text-md font-medium">{section.toLowerCase()}</h1>
          {
            programDataLodaing ? <div className="flex items-center space-x-2">
              <p className="text-sm">Loading.....</p>
            </div> :
              <div className="flex items-center space-x-2">
                <p className="text-md font-medium">FY: {(totalQty.totalFY).toLocaleString('hi-IN')} | Q1: {(totalQty.totalQ1).toLocaleString('hi-IN')} | Q2: {(totalQty.totalQ2).toLocaleString('hi-IN')} | Q3: {(totalQty.totalQ3).toLocaleString('hi-IN')} | Q4: {(totalQty.totalQ4).toLocaleString('hi-IN')}</p>
                <span className="text-lg font-bold transition-transform group-open:rotate-90">→</span>
              </div>
          }
        </summary>

        <div className='flex gap-2 items-center'>
          <div className='w-72 mt-3 '>
            <DropdownMenu.Root >
              <DropdownMenu.Trigger asChild>
                <button className="cursor-pointer  py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center w-full">
                  <span className='capitalize'>{filter?.name.toLowerCase()} </span>
                  <RiArrowDropDownLine size={30} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[250px]"
              >
                {subProgramActivites.sort((a, b) => a.name.localeCompare(b.name)).map((val, ind) => (
                  <DropdownMenu.Item
                    key={ind}
                    className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer text-sm capitalize"
                    onSelect={() => handleSelect(val)}
                  >
                    {val.name.toLowerCase()}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
          <Marquee className='flex flex-col w-full items-end pr-10 font-medium gap-1 '>
            {
              subProgramActivites.map((pa) => {
                if (pa.name == "All")
                  return
                const activityData = programData?.activityTotals.find((activity) =>
                  Number(activity.activityId) == pa.map
                )
                return <span key={pa.map} className='mr-2 text-medium'>
                  <span className='text-green-800 font-semibold'> {pa.name}</span> | FY : {activityData ? (Number(activityData?.q1) + Number(activityData?.q2) + Number(activityData?.q3) + Number(activityData?.q4)).toLocaleString('hi-IN') : "NA"} | Q1 : {activityData ? Number(activityData?.q1).toLocaleString('hi-IN') : "NA"} | Q2: {activityData ? Number(activityData?.q2).toLocaleString('hi-IN') : "NA"} | Q3 : {activityData ? Number(activityData?.q3).toLocaleString('hi-IN') : "NA"} | Q4: {activityData ? Number(activityData?.q4).toLocaleString('hi-IN') : "NA"}
                </span>

              })
            }
          </Marquee>

        </div>

        <hr className="my-2 scale-x-150 " />

        <div className="bg-gray-50 overflow-scroll">
          {/* Table */}
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left text-sm  text-gray-600">
                <th className="border p-2 capitalize">{"Particular".toLowerCase()}</th>
                {months.map((month) => (
                  <th key={month} className="border p-2 capitalize">{month.toLowerCase()}</th>
                ))}
              </tr>
            </thead>
            {
              !programDataLodaing && <tbody>
                {programData?.subCategories.map((sub) => (
                  <tr
                    key={sub.subCategoryId}
                    className="text-sm transition hover:bg-gray-100"
                  >

                    <td className="border p-2 font-medium capitalize">{sub.subCategoryName.toLowerCase()}</td>
                    {months.map((month, key) => (
                      <td key={month} className="border p-2">
                        <input
                          disabled={true}
                          // disabled={key == 2 || key == 8 || key == 14 || key == 20 || filter?.map == 0 || (userData.data?.user.role == 1 && status == "draft") || (userData.data?.user.role == 2 && status != "draft")}
                          type={key % 6 == 0 ? "number" : "text"}
                          id={sub.subCategoryId + month}
                          className="w-full rounded border p-1"
                          value={tableData[sub.subCategoryId]?.[month] ?? ""}
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
                    {/* <td className="border p-2">
                      <BiComment className="text-xl" />
                    </td> */}
                  </tr>
                ))}
              </tbody>
            }

          </table>
        </div>
        {
          filter?.map != 0 && subdepartmentId != 0 && deptId != "0" && ((userData.data?.user.role == 1 && status != "draft") || (userData.data?.user.role != 1 && status == "draft")) && <div className="py-2 pr-4 flex flex-row-reverse gap-2">
            {
              !inputStates && <div>
                {
                  saveBtnState == "loading" && <Button
                    type="button"
                    className=" !text-white !bg-primary px-2 !w-20 !text-lg border border-black !cursor-not-allowed"
                    variant="soft"
                  // Disable the button if input is empty
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
                    Save
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

export default ActivityBudget;

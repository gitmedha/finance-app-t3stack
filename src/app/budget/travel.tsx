"use client";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { api } from "~/trpc/react";
import {  toast,Bounce } from 'react-toastify';


interface TravelBudgetProps {
  section: string;
  categoryId: number;
  budgetId: number;
  deptId: string;
  searchSubCatId:number
  status: string | undefined
  sectionOpen: null | "PERSONNEL" | "Program Activities" | "Travel" | "PROGRAM OFFICE" | "CAPITAL COST" | "OVERHEADS"
  setSectionOpen: (val: null | "PERSONNEL" | "Program Activities" | "Travel" | "PROGRAM OFFICE" | "CAPITAL COST" | "OVERHEADS") => void
  subdepartmentId: number
}

interface subTravelSchema {
  map: number
  name: string
}

const subTravels: subTravelSchema[] = [
  { map: 1, name: "Accomodation" },
  { map: 2, name: "Local Conveyance" },
  { map: 3, name: "Per Deim" },
  { map: 4, name: "Tour & Travel" },
  {map:0,name:"All"}
]
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
  "Qty1",
  "Apr",
  "May",
  "Jun",
  "Qty2",
  "Jul",
  "Aug",
  "Sep",
  "Qty3",
  "Oct",
  "Nov",
  "Dec",
  "Qty4",
  "Jan",
  "Feb",
  "Mar",
];

const TravelBudget: React.FC<TravelBudgetProps> = ({ section, categoryId, budgetId, deptId, searchSubCatId, status, sectionOpen, setSectionOpen, subdepartmentId }) => {
  const [inputStates, setInputStates] = useState<boolean>(true)
  const [saveBtnState, setSaveBtnState] = useState<"loading" | "edit" | "save">("loading")
  const userData = useSession()
  const [totalQty, setTotalQty] = useState<totalschema>({
    totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0
  })
  const [tableData, setTableData] = useState<TableData>({});
  const [filter, setFilter] = useState(subTravels.sort((a, b) => a.name.localeCompare(b.name))[0])
  const handleSubCatSelect = (val: subTravelSchema) => {
    setSaveBtnState("loading")
    setFilter(val)
    
  }
  const handelnputDisable = (disable: boolean) => {
    const subcategoryIds = []
    setInputStates(disable)
    for (const [subcategoryId, subcategoryData] of Object.entries(tableData)) {
      subcategoryIds.push(subcategoryId)
    }
    subcategoryIds.forEach((id) => {
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
      if (aprIn && mayIn && junIn && julIn && augIn && sepIn && octIn && novIn && decIn && janIn && febIn && marIn && qty1In && qty2In && qty3In && qty4In) {
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
        console.error(`Input element with ID  not found.`);
      }
    })
  }
  const updateTotalQtyVals = (which: string, difference: number) => {
    setTotalQty((prev) => {
      const updatedTotal = { ...prev };
      updatedTotal[which as keyof typeof prev] += difference;
      console.log(updatedTotal)
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
  const { data: travelData, isLoading: travelDataLodaing } = api.get.getTravelCatDetials.useQuery(
  {
    budgetId,
    catId: categoryId,
    deptId: Number(deptId),
    activity: (filter?.map)?.toString(),
    searchSubCatId:searchSubCatId,
    subDeptId:subdepartmentId
  },{
    staleTime:0,
  })
  useEffect(() => {
    if (travelData?.budgetId == budgetId) {
      const initialData: TableData = {};
      if (travelData?.subCategories) {
        // console.log("After getting the subcategories")
        travelData.subCategories.forEach((sub) => {
          initialData[sub.subCategoryId] = {
            Count: "",
            Qty1: 0,
            Apr: "0",
            May: "0",
            Jun: "0",
            Qty2: 0,
            Jul: "0",
            Aug: "0",
            Sep: "0",
            Qty3: 0,
            Oct: "0",
            Nov: "0",
            Dec: "0",
            Qty4: "0",
            Jan: "0",
            Feb: "0",
            Mar: "0",
            budgetDetailsId: 0
          };
          
        });
        if (travelData.result && travelData.result.length > 0) {
          // console.log("After getting the categorydetails")
          console.log("Data present")
          setSaveBtnState("edit")
          const totalQtyAfterBudgetDetails: totalschema = { totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0 }
          travelData.result.forEach((item) => {
            // !we can remove this if we are updating these values in the save and update function of the personal data
            // const personalDataForSubCat = travelData.personalData.find((subCat)=> subCat.subcategoryId == item.subcategoryId)
            // if(!personalDataForSubCat){
              initialData[item.subcategoryId] = {
                Count: Number(item.total),
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
                Qty1: item.qty1 ? Number(item.qty1) : "0",
                Qty2: item.qty2 ? Number(item.qty2) : "0",
                Qty3: item.qty3 ? Number(item.qty3) : "0",
                Qty4: item.qty4 ? Number(item.qty4) : "0",
                budgetDetailsId: Number(item.id)
              };
            totalQtyAfterBudgetDetails.totalQ1 += Number(item.april) + Number(item.may) + Number(item.june)
            totalQtyAfterBudgetDetails.totalQ2 += Number(item.july) + Number(item.august) + Number(item.september)
            totalQtyAfterBudgetDetails.totalQ3 += Number(item.october) + Number(item.november) + Number(item.december)
            totalQtyAfterBudgetDetails.totalQ4 += Number(item.january) + Number(item.february) + Number(item.march)
            
          });
          setTableData(initialData);
          setTotalQty(totalQtyAfterBudgetDetails)
        }
        else if (travelData.levelStats || travelData.personalData) {
          const totalQtyAfterBudgetDetails: totalschema = { totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0 }
          setTotalQty(totalQtyAfterBudgetDetails)
          setSaveBtnState("save")
          travelData.subCategories.forEach((sub, index) => {
            if(travelData.personalData && travelData.personalData.length > 0)
            {
              const level = travelData.personalData.find(
                (level) => level.subcategoryId === sub.subCategoryId
              );
              if (filter?.map == 0) {
                initialData[sub.subCategoryId] = {
                  Count: level?.qty ? Number(level?.qty) : 0,
                  Qty1: level?.qty1 ? Number(level?.qty1) * 4 : 0,
                  Qty2: level?.qty2 ? Number(level?.qty2) * 4 : 0,
                  Qty3: level?.qty3 ? Number(level?.qty3) * 4 : 0,
                  Qty4: level?.qty4 ? Number(level?.qty4) * 4 : 0,
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
              }
              else {
                initialData[sub.subCategoryId] = {
                  Count: level?.qty ? Number(level?.qty) : 0,
                  Qty1: level?.qty1 ? Number(level?.qty1) : 0,
                  Qty2: level?.qty2 ? Number(level?.qty2) : 0,
                  Qty3: level?.qty3 ? Number(level?.qty3) : 0,
                  Qty4: level?.qty4 ? Number(level?.qty4) : 0,
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
              }
            }
            else
            {
              const level = travelData.levelStats?.find(
                (level) => level.level === sub.subCategoryId
              );
              if (filter?.map == 0) {
                initialData[sub.subCategoryId] = {
                  Count: level?.employeeCount ? Number(level?.employeeCount) : 0,
                  Qty1: level?.employeeCount ? Number(level?.employeeCount) * 4 : 0,
                  Qty2: level?.employeeCount ? Number(level?.employeeCount) * 4 : 0,
                  Qty3: level?.employeeCount ? Number(level?.employeeCount) * 4 : 0,
                  Qty4: level?.employeeCount ? Number(level?.employeeCount) * 4 : 0,
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
              }
              else {
                initialData[sub.subCategoryId] = {
                  Count: level?.employeeCount ? Number(level?.employeeCount) : 0,
                  Qty1: level?.employeeCount ? Number(level?.employeeCount) : 0,
                  Qty2: level?.employeeCount ? Number(level?.employeeCount) : 0,
                  Qty3: level?.employeeCount ? Number(level?.employeeCount) : 0,
                  Qty4: level?.employeeCount ? Number(level?.employeeCount) : 0,
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
              }
            }
          });
          setTableData(initialData);
        }
      }

    }

  }, [travelData])
  useEffect(() => {
    handelnputDisable(true)
  }, [filter])


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

  const createBudgetDetails = api.post.saveTravelBudgetDetails.useMutation();
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
      notes: undefined,
      description: undefined,
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
      clusterId: undefined,
      createdBy: userData.data?.user.id ?? 1,
      createdAt: new Date().toISOString(),
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
        transition: Bounce,
      });
    }
  };
  const updateBudgetDetails = api.post.updateBudgetDetails.useMutation();
  const handleUpdate = async () => {
    setSaveBtnState("loading")
    const budgetDetails = Object.entries(tableData).map(([subCategoryId, data]) => ({
      budgetDetailsId: data.budgetDetailsId,
      catid: categoryId,
      subcategoryId: parseInt(subCategoryId, 10),
      unit: 1,
      rate: "1",
      total: "1",
      currency: "INR",
      notes: undefined,
      description: undefined,
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
      clusterId: undefined,
      updatedBy: userData.data?.user.id ?? 1,
      updatedAt: new Date().toISOString(),
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
            
          },
        }
      );
    } catch (error) {
      console.error("Error updating budget:", error);
      toast.warn('Error While saving ', {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
    finally {
      setSaveBtnState("edit")
    }
  };

  return (
    <div className="my-6 rounded-md bg-white shadow-lg">
      <details
        className={`group mx-auto w-full overflow-hidden rounded bg-[#F5F5F5] shadow transition-[max-height] duration-500`}
        open={sectionOpen == "Travel"}
        onClick={(e) => {
          e.preventDefault()
        }}
        >
        <summary className="flex cursor-pointer items-center justify-between rounded-md border border-primary bg-primary/10 p-2 text-primary outline-none" 
          onClick={(e) => {
            e.preventDefault()
            if (sectionOpen == "Travel")
              setSectionOpen(null)
            else
              setSectionOpen("Travel")
          }}>
          <h1 className=" uppercase ">{section}</h1>
          {
            travelDataLodaing ? <div className="flex items-center space-x-2">
              <p className="text-sm">Loading.....</p>
            </div> :
              <div className="flex items-center space-x-2">
                <p className="text-sm">Total Cost: Q1:{totalQty.totalQ1}, Q2:{totalQty.totalQ2}, Q3:{totalQty.totalQ3}, Q4:{totalQty.totalQ4}</p>
                <span className="text-lg font-bold transition-transform group-open:rotate-90">→</span>
              </div>
          }
        </summary>

          <div className='flex gap-2'>
          <div className='w-72 mt-3 z-10'>
            <DropdownMenu.Root >
              <DropdownMenu.Trigger asChild>
                <button className="cursor-pointer  py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center w-full">
                  <span>{filter?.name} </span>
                  <RiArrowDropDownLine size={30} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[280px]"
              >
                {subTravels.sort((a, b) => a.name.localeCompare(b.name)).map((val, ind) => (
                  <DropdownMenu.Item
                    key={ind}
                    className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer text-sm"
                    onSelect={() => handleSubCatSelect(val)}
                  >
                    {val.name}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>

          </div>
          </div>
        

        <hr className="my-2 scale-x-150" />
        
        <div className="bg-gray-50 overflow-scroll">
          {/* Table */}
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left text-sm uppercase text-gray-600">
                <th className="border p-2">Particulars</th>
                <th scope="col" className="border p-2">
                  #
                </th>
                <th scope="col" className="border p-2">
                  Apr
                </th>
                <th scope="col" className="border p-2">
                  May
                </th>
                <th scope="col" className="border p-2">
                  Jun
                </th>

                <th scope="col" className="border p-2">
                  #
                </th>
                <th scope="col" className="border p-2">
                  Jul
                </th>
                <th scope="col" className="border p-2">
                  Aug
                </th>
                <th scope="col" className="border p-2">
                  Sep
                </th>

                <th scope="col" className="border p-2">
                  #
                </th>
                <th scope="col" className="border p-2">
                  Oct
                </th>
                <th scope="col" className="border p-2">
                  Nov
                </th>
                <th scope="col" className="border p-2">
                  Dec
                </th>

                <th scope="col" className="border p-2">
                  #
                </th>
                <th scope="col" className="border p-2">
                  Jan
                </th>
                <th scope="col" className="border p-2">
                  Feb
                </th>
                <th scope="col" className="border p-2">
                  Mar
                </th>
               
              </tr>
            </thead>
            {!travelDataLodaing && <tbody>
              {travelData?.subCategories.map((sub) => (
                <tr
                  key={sub.subCategoryId}
                  className="text-sm transition hover:bg-gray-100"
                >
                  <td className="border p-2 font-medium">{sub.subCategoryName}</td>
                  {months.map((month, key) => (
                    <td key={month} className="border p-2">
                      <input
                        disabled={inputStates}
                        id={sub.subCategoryId + month}
                        type={key % 4 == 0 ? "number" : "text"}
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
                </tr>
              ))}
            </tbody> }
          </table> 
        </div>
        {
          filter?.map != 0 && ((userData.data?.user.role == 1 && status != "draft") || (userData.data?.user.role != 1 && status == "draft"))  && <div className="py-2 pr-4 flex flex-row-reverse gap-2">
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
                {saveBtnState == "save" &&
                  <Button
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

export default TravelBudget;

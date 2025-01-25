"use client";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { api } from "~/trpc/react";

interface TravelBudgetProps {
  section: string;
  categoryId: number;
  budgetId: number;
  deptId: string;
  searchSubCatId:number
  status: string | undefined
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

const TravelBudget: React.FC<TravelBudgetProps> = ({ section, categoryId, budgetId, deptId,searchSubCatId,status }) => {
  const [saveBtnState, setSaveBtnState] = useState<"loading" | "edit" | "save">("loading")
  const [erroMsg, setErrorMsg] = useState<string | null>(null)
  const userData = useSession()
  const [totalQty, setTotalQty] = useState<totalschema>({
    totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0
  })
  // const { data: subCategories } = api.get.getSubCats.useQuery({ categoryId:searchSubCatId });
  const [tableData, setTableData] = useState<TableData>({});

  const [filter, setFilter] = useState(subTravels.sort((a, b) => a.name.localeCompare(b.name))[0])
  const handleSelect = (val: subTravelSchema) => {
    setErrorMsg(null)
    setSaveBtnState("loading")
    setFilter(val)
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
  // const { data: categoriesBudgetDetails, isLoading: categoryDetailsLoading, error } = api.get.getCatsBudgetDetails.useQuery({
  //   budgetId,
  //   catId: categoryId,
  //   deptId: Number(deptId),
  //   activity: (filter?.map)?.toString()
  // }, {
  //   enabled: !!filter
  // });
  // const { data: levelEmployeesCount } = api.get.getLevelStaffCount.useQuery(
  //   {
  //     deptId: Number(deptId),
  //   },
  //   {
  //     enabled:
  //       !categoryDetailsLoading &&
  //       (!!error || !categoriesBudgetDetails || categoriesBudgetDetails.length === 0),
  //   }
  // );
  // making a call to get the travel section detatils
  const { data: travelData, isLoading: travelDataLodaing } = api.get.getTravelCatDetials.useQuery({
    budgetId,
    catId: categoryId,
    deptId: Number(deptId),
    activity: (filter?.map)?.toString(),
    searchSubCatId:searchSubCatId
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
          setSaveBtnState("edit")
          const totalQtyAfterBudgetDetails: totalschema = { totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0 }
          travelData.result.forEach((item) => {
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
        else if (travelData.levelStats) {
          setSaveBtnState("save")
          console.log("After getting the level count")
          travelData.subCategories.forEach((sub, index) => {
            const level = travelData.levelStats?.find(
              (level) => level.level === sub.subCategoryId
            );
            if(filter?.map == 0)
            {
              initialData[sub.subCategoryId] = {
                Count: level?.employeeCount ? Number(level?.employeeCount) : 0,
                Qty1: level?.employeeCount ? Number(level?.employeeCount)*4 : 0,
                Qty2: level?.employeeCount ? Number(level?.employeeCount)*4 : 0,
                Qty3: level?.employeeCount ? Number(level?.employeeCount) *4: 0,
                Qty4: level?.employeeCount ? Number(level?.employeeCount)*4 : 0,
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
            else{
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
            
          });
          setTableData(initialData);
        }
        else
        {
          setErrorMsg("There is error in finding the both budgetDetails and staff count details")
        }
      }

    }

  }, [travelData])
  // useEffect(() => {
  //   const initialData: TableData = {};
  //   if (subCategories?.subCategories) {
  //     subCategories.subCategories.forEach((sub) => {
  //       initialData[sub.subCategoryId] = {
  //         Count: "",
  //         Qty1: 0,
  //         Apr: "0",
  //         May: "0",
  //         Jun: "0",
  //         Qty2: 0,
  //         Jul: "0",
  //         Aug: "0",
  //         Sep: "0",
  //         Qty3: 0,
  //         Oct: "0",
  //         Nov: "0",
  //         Dec: "0",
  //         Qty4: "0",
  //         Jan: "0",
  //         Feb: "0",
  //         Mar: "0",
  //         budgetDetailsId: 0
  //       };
  //     });
  //   }
  //   if (categoriesBudgetDetails) {
  //     const totalQtyAfterBudgetDetails: totalschema = { totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0 }
  //     categoriesBudgetDetails.forEach((item) => {
  //       initialData[item.subcategoryId] = {
  //         Count: Number(item.total),
  //         Apr: item.april ? Number(item.april) : "0",
  //         May: item.may ? Number(item.may) : "0",
  //         Jun: item.june ? Number(item.june) : "0",
  //         Jul: item.july ? Number(item.july) : "0",
  //         Aug: item.august ? Number(item.august) : "0",
  //         Sep: item.september ? Number(item.september) : "0",
  //         Oct: item.october ? Number(item.october) : "0",
  //         Nov: item.november ? Number(item.november) : "0",
  //         Dec: item.december ? Number(item.december) : "0",
  //         Jan: item.january ? Number(item.january) : "0",
  //         Feb: item.february ? Number(item.february) : "0",
  //         Mar: item.march ? Number(item.march) : "0",
  //         Qty1: item.qty1 ? Number(item.qty1) : "0",
  //         Qty2: item.qty2 ? Number(item.qty2) : "0",
  //         Qty3: item.qty3 ? Number(item.qty3) : "0",
  //         Qty4: item.qty4 ? Number(item.qty4) : "0",
  //         budgetDetailsId: Number(item.id)
  //       };
  //       totalQtyAfterBudgetDetails.totalQ1 += Number(item.april) + Number(item.may) + Number(item.june)
  //       totalQtyAfterBudgetDetails.totalQ2 += Number(item.july) + Number(item.august) + Number(item.september)
  //       totalQtyAfterBudgetDetails.totalQ3 += Number(item.october) + Number(item.november) + Number(item.december)
  //       totalQtyAfterBudgetDetails.totalQ4 += Number(item.january) + Number(item.february) + Number(item.march)
  //     });
  //     setTableData(initialData);
  //     setTotalQty(totalQty)
  //   }
  //   else {
  //     setTableData({});
  //   }
  // }, [categoriesBudgetDetails]);
  // useEffect(() => {
  //   if (subCategories && levelEmployeesCount) {
  //     const initialTableData: TableData = {};
  //     subCategories?.subCategories?.forEach((sub, index) => {
  //       const level = levelEmployeesCount?.find(
  //         (l) => l.level === sub.subCategoryId
  //       );
  //       initialTableData[sub.subCategoryId] = {
  //         Count: level?.employeeCount ? Number(level?.employeeCount) : 0,
  //         Qty1: level?.employeeCount ? Number(level?.employeeCount):0,
  //         Qty2: level?.employeeCount ? Number(level?.employeeCount) : 0,
  //         Qty3: level?.employeeCount ? Number(level?.employeeCount) : 0,
  //         Qty4: level?.employeeCount ? Number(level?.employeeCount) : 0,
  //         Apr:"0",
  //         May:"0",
  //         Jun:"0",
  //         Jul:"0",
  //         Aug:"0",
  //         Sep:"0",
  //         Oct:"0",
  //         Nov:"0",
  //         Dec:"0",
  //         Jan:"0",
  //         Feb:"0",
  //         Mar:"0",
  //         budgetDetailsId: 0,
  //       };
  //     })
  //     setTableData(initialTableData);
  //   }
  // }, [subCategories, levelEmployeesCount]);
  const handleInputChange = (
    subCategoryId: number,
    month: string,
    value: string,
  ) => {
    setErrorMsg(null)
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

  const createBudgetDetails = api.post.addBudgetDetails.useMutation();
  const handleSave = async () => {
    const budgetDetails = Object.entries(tableData).map(([subCategoryId, data]) => ({
      budgetid: budgetId,
      catid: categoryId,
      subcategoryId: parseInt(subCategoryId, 10),
      unit: 1,
      rate: "1",
      total: "1",
      currency: "USD",
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
        },
        {
          onSuccess: (data) => {
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
            setErrorMsg(JSON.stringify(error))
            console.error("Error creating budget:", error);
          },
        }
      );
    } catch (error) {
      console.error("Failed to save budget details:", error);
      alert("Failed to save budget details. Please try again.");
    }
  };
  const updateBudgetDetails = api.post.updateBudgetDetails.useMutation();
  const handleUpdate = async () => {
    const budgetDetails = Object.entries(tableData).map(([subCategoryId, data]) => ({
      budgetDetailsId: data.budgetDetailsId,
      catid: categoryId,
      subcategoryId: parseInt(subCategoryId, 10),
      unit: 1,
      rate: "1",
      total: "1",
      currency: "USD",
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
            console.log("Budget updated successfully:", data);
          },
          onError: (error) => {
            throw new Error(JSON.stringify(error))
            
          },
        }
      );
    } catch (error) {
      setErrorMsg(JSON.stringify(error))
      console.error("Error updating budget:", error);
      alert("Failed to update budget details. Please try again.");
    }
    finally {
      setSaveBtnState("edit")
    }
  };

  return (
    <div className="my-6 rounded-md bg-white shadow-lg">
      <details
        className={`group mx-auto w-full overflow-hidden rounded bg-[#F5F5F5] shadow transition-[max-height] duration-500`}
      >
        <summary className="flex cursor-pointer items-center justify-between rounded-md border border-primary bg-primary/10 p-2 text-primary outline-none">
          <h1 className=" uppercase ">{section}</h1>
          {
            travelDataLodaing ? <div className="flex items-center space-x-2">
              <p className="text-sm">Loading.....</p>
            </div> :
              <div className="flex items-center space-x-2">
                <p className="text-sm">Total Cost: Q1:{totalQty.totalQ1} Q2:{totalQty.totalQ2} Q3:{totalQty.totalQ3} Q4:{totalQty.totalQ4}</p>
                <span className="text-lg font-bold transition-transform group-open:rotate-90">→</span>
              </div>
          }
        </summary>

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
                  onSelect={() => handleSelect(val)} 
                >
                  {val.name}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>

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
                        disabled={filter?.map == 0 || (userData.data?.user.role == 1 && status == "draft") || (userData.data?.user.role == 2 && status != "draft")}
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
          {erroMsg && <p className="text-red-600 text-sm">{erroMsg}</p>}
        </div>
        {
          filter?.map != 0 && <div className="py-2 pr-4 flex flex-row-reverse ">
            {
              saveBtnState == "loading" && ((userData.data?.user.role == 1 && status != "draft") || (userData.data?.user.role != 1 && status == "draft")) && <Button
                type="button"
                className=" !text-white !bg-primary px-2 !w-20 !text-lg border border-black !cursor-not-allowed"
                variant="soft"
              // Disable the button if input is empty
              >
                Loading...
              </Button>
            }
            {
              saveBtnState == "edit" && ((userData.data?.user.role == 1 && status != "draft") || (userData.data?.user.role != 1 && status == "draft")) &&  <Button
                type="button"
                className="cursor-pointer !text-white !bg-primary px-2 !w-20 !text-lg border border-black !disabled:cursor-not-allowed"
                variant="soft"
                style={{ cursor: isSaveDisabled() ? "not-allowed" : "pointer" }}
                disabled={isSaveDisabled()}
                onClick={() => handleUpdate()}
              >
                Edit
              </Button>}
            {saveBtnState == "save" && ((userData.data?.user.role == 1 && status != "draft") || (userData.data?.user.role != 1 && status == "draft")) &&
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
        
      </details>
    </div>
  );
};

export default TravelBudget;

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
]
interface LevelData {
  budgetDetailsId: number
  Count: string | number;
  [month: string]: string | number;
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

const TravelBudget: React.FC<TravelBudgetProps> = ({ section, categoryId, budgetId, deptId,searchSubCatId }) => {
  // Initialize table data
  const userData = useSession()
  const { data, refetch } = api.get.getSubCats.useQuery({ categoryId:searchSubCatId });

  const [tableData, setTableData] = useState<TableData>({});

  const [filter, setFilter] = useState(subTravels.sort((a, b) => a.name.localeCompare(b.name))[0])
  const handleSelect = (val: subTravelSchema) => {
    setFilter(val)
  }

  const isSaveDisabled = () => {
    return Object.values(tableData).some((subData) => {
      return months.some((month) => {
        return !subData[month]?.toString().trim();
      });
    });
  };
  const { data: categoriesBudgetDetails, isLoading, error } = api.get.getCatsBudgetDetails.useQuery({
    budgetId,
    catId: categoryId,
    deptId: Number(deptId),
    activity: (filter?.map)?.toString()
  }, {
    enabled: !!filter
  });
  useEffect(() => {
    const initialData: TableData = {};
    if (data?.subCategories) {
      data.subCategories.forEach((sub) => {
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
    }
    if (categoriesBudgetDetails) {
      categoriesBudgetDetails.forEach((item) => {
        initialData[item.subcategoryId] = {
          Count: item.total,
          Apr: item.april ? item.april : "0",
          May: item.may ? item.may : "0",
          Jun: item.june ? item.june : "0",
          Jul: item.july ? item.july : "0",
          Aug: item.august ? item.august : "0",
          Sep: item.september ? item.september : "0",
          Oct: item.october ? item.october : "0",
          Nov: item.november ? item.november : "0",
          Dec: item.december ? item.december : "0",
          Jan: item.january ? item.january : "0",
          Feb: item.february ? item.february : "0",
          Mar: item.march ? item.march : "0",
          Qty1: item.qty1 ? item.qty1 : "0",
          Qty2: item.qty2 ? item.qty2 : "0",
          Qty3: item.qty3 ? item.qty3 : "0",
          Qty4: item.qty4 ? item.qty4 : "0",
          budgetDetailsId: item.id
        };
      });
      setTableData(initialData);
    }
    else {
      // If categoriesBudgetDetails is not available, initialize with empty data
      setTableData({});
    }
  }, [categoriesBudgetDetails]);

  const handleInputChange = (
    subCategoryId: number,
    month: string,
    value: string,
  ) => {
    setTableData((prev) => ({
      ...prev,
      [subCategoryId]: {
        ...prev[subCategoryId],
        [month]: value,
      },
    }));
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
            console.log("Budget created successfully:", data);
          },
          onError: (error) => {
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
            console.error("Error updating budget:", error);
          },
        }
      );
    } catch (error) {
      console.error("Failed to update budget details:", error);
      alert("Failed to update budget details. Please try again.");
    }
  };

  return (
    <div className="my-6 rounded-md bg-white shadow-lg">
      <details
        className={`group mx-auto w-full overflow-hidden rounded bg-[#F5F5F5] shadow transition-[max-height] duration-500`}
      >
        <summary className="flex cursor-pointer items-center justify-between rounded-md border border-primary bg-primary/10 p-2 text-primary outline-none">
          <h1 className=" uppercase ">{section}</h1>
          <div className="flex items-center space-x-2">
            <p className="text-sm">Avg Cost: Q1: XXX Q2: XXX Q3: XXX Q4: XXX</p>
            {/* Rotate arrow when details are open */}
            <span className="text-lg font-bold transition-transform group-open:rotate-90">
              →
            </span>
          </div>
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
                  className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
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
            <tbody>
              {data?.subCategories.map((sub) => (
                <tr
                  key={sub.subCategoryId}
                  className="text-sm transition hover:bg-gray-100"
                >
                  <td className="border p-2 font-medium">{sub.subCategoryName}</td>
                  {months.map((month, key) => (
                    <td key={month} className="border p-2">
                      <input
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
            </tbody>
          </table>
        </div>
        <div className="py-2 pr-4 flex flex-row-reverse ">
          {
            categoriesBudgetDetails && categoriesBudgetDetails.length > 0 ? <Button
              type="button"
              className="cursor-pointer !text-white !bg-primary px-2 !w-20 !text-lg border border-black !disabled:cursor-not-allowed"
              variant="soft"
              style={{ cursor: isSaveDisabled() ? "not-allowed" : "pointer" }}
              disabled={isSaveDisabled()}
              onClick={() => handleUpdate()}
            >
              Edit
            </Button> : <Button
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
      </details>
    </div>
  );
};

export default TravelBudget;

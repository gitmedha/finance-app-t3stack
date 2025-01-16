"use client";

import { Button } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";

interface ProgramOfficeProps {
  section: string;
  categoryId: number;
  budgetId: number;
  deptId: string;
}

interface LevelData {
  budgetDetailsId: number
  Count: string | number;
  [month: string]: string | number;
}

type TableData = Record<string, LevelData>;


const months = [
  "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar",
];

const ProgramOffice: React.FC<ProgramOfficeProps> = ({ section, categoryId, budgetId, deptId }) => {
  const userData = useSession()
  const { data, refetch } = api.get.getSubCats.useQuery({ categoryId });
  const [tableData, setTableData] = useState<TableData>({});

  // Handle input changes with strict typing
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
  });
  useEffect(() => {
    const initialData: TableData = {};

    if (data?.subCategories) {
      data.subCategories.forEach((sub) => {
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
    }

    // Populate tableData with data from categoriesBudgetDetails if available
    if (categoriesBudgetDetails) {
      console.log(categoriesBudgetDetails)
      categoriesBudgetDetails.forEach((item) => {
        initialData[item.subcategoryId] = {
          Count: item.total,
          Apr: item.april ?? "",
          May: item.may ?? "",
          Jun: item.june ?? "",
          Jul: item.july ?? "",
          Aug: item.august ?? "",
          Sep: item.september ?? "",
          Oct: item.october ?? "",
          Nov: item.november ?? "",
          Dec: item.december ?? "",
          Jan: item.january ?? "",
          Feb: item.february ?? "",
          Mar: item.march ?? "",
          budgetDetailsId: item.id,
        };
      });

    }

    setTableData(initialData);
  }, [data, categoriesBudgetDetails]);
  const createBudgetDetails = api.post.addBudgetDetails.useMutation();
  const handleSave = async () => {
    // If validation passes, proceed with saving the budget details
    const budgetDetails = Object.entries(tableData).map(([subCategoryId, data]) => ({
      budgetid: budgetId,
      catid: categoryId,
      subcategoryId: parseInt(subCategoryId, 10),
      unit: 1,
      rate: "1",
      total: "1",
      currency: "USD",
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
      subcategoryId: parseInt(subCategoryId, 10),
      unit: 1,
      rate: "1",
      total: "1",
      currency: "USD",
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
    console.log(tableData)
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

        <hr className="my-2 scale-x-150" />

        <div className="bg-gray-50 overflow-scroll">
          {/* Table */}
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left text-sm uppercase text-gray-600">
                <th className="border p-2">PROGRAM OFFICE</th>

                {months.map((month) => (
                <th key={month} className="border p-2">{month}</th>
                ))}
              
              </tr>
            </thead>
            <tbody>
              {data?.subCategories.map((sub) => (
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
      {/* Section Header */}
    </div>
  );
};

export default ProgramOffice;

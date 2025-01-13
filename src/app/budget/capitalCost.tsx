import { Button } from "@radix-ui/themes";
import React, { useState, useEffect } from "react";
import { api } from "~/trpc/react";

interface CapitalCostProps {
  section: string;
  categoryId: number;
  budgetId: number;
  deptId: string;
}

interface LevelData {
  budgetDetailsId:number
  Count: string | number;
  [month: string]: string | number;
}

type TableData = Record<string, LevelData>;

const months = [
  "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar",
];

const CapitalCost: React.FC<CapitalCostProps> = ({ section, categoryId, budgetId, deptId }) => {
  const { data, refetch } = api.get.getSubCats.useQuery({ categoryId });
  const [tableData, setTableData] = useState<TableData>({});

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

  // Check if all the month values in the tableData are filled
  const isSaveDisabled = () => {
    return Object.values(tableData).some((subData) => {
      return months.some((month) => {
        return !subData[month]?.toString().trim(); // Checks if any month is empty
      });
    });
  };

  const { data: categoriesBudgetDetails, isLoading, error } = api.get.getCatsBudgetDetails.useQuery({
    budgetId,
    catId: categoryId,
    deptId: Number(deptId),
  });

  useEffect(() => {
    // Initialize tableData with empty strings for all subcategories and months
    const initialData: TableData = {};

    if (data?.subCategories) {
      data.subCategories.forEach((sub) => {
        initialData[sub.subCategoryId] = {
          Count: "",
          Apr: "",
          May: "",
          Jun: "",
          Jul: "",
          Aug: "",
          Sep: "",
          Oct: "",
          Nov: "",
          Dec: "",
          Jan: "",
          Feb: "",
          Mar: "",
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
      activity: "Some activity",
      deptId: 9,
      clusterId: undefined,
      createdBy: 3,
      createdAt: "2022-12-11",
    }));

    try {
      createBudgetDetails.mutate(
        {
          deptId: 9,
          budgetId: 8,
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
      updatedBy: 3,
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




  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="my-6 rounded-md bg-white shadow-lg">
      <details className="group mx-auto w-full overflow-hidden rounded bg-[#F5F5F5] shadow">
        <summary className="flex cursor-pointer items-center justify-between rounded-md border border-primary bg-primary/10 p-2 text-primary">
          <h1 className="uppercase">{section}</h1>
          <div className="flex items-center space-x-2">
            <p className="text-sm">Avg Cost: Q1: XXX Q2: XXX Q3: XXX Q4: XXX</p>
            <span className="text-lg font-bold transition-transform group-open:rotate-90">→</span>
          </div>
        </summary>

        <hr className="my-2 scale-x-150" />

        <div className="bg-gray-50 overflow-scroll">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left text-sm uppercase text-gray-600">
                <th className="border p-2">CAPITAL COST</th>
                {months.map((month) => (
                  <th key={month} className="border p-2">{month}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.subCategories.map((sub) => (
                <tr key={sub.subCategoryId} className="text-sm transition hover:bg-gray-100">
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

        <div className="py-2 pr-4 flex flex-row-reverse">
          {
            categoriesBudgetDetails && categoriesBudgetDetails.length > 0 ? <Button
              type="button"
              className="cursor-pointer !text-white !bg-primary px-2 !w-20 !text-lg border border-black !disabled:cursor-not-allowed"
              variant="soft"
              style={{ cursor: isSaveDisabled() ? "not-allowed" : "pointer" }}
              disabled={isSaveDisabled()}
              onClick={() => handleUpdate()}
            // Disable the button if input is empty
            >
              Edit
            </Button> : <Button
              type="button"
              className="cursor-pointer !text-white !bg-primary px-2 !w-20 !text-lg border border-black !disabled:cursor-not-allowed"
              variant="soft"
              style={{ cursor: isSaveDisabled() ? "not-allowed" : "pointer" }}
              disabled={isSaveDisabled()}
              onClick={() => handleSave()}
            // Disable the button if input is empty
            >
              Save
            </Button>
          }
          
        </div>
      </details>
    </div>
  );
};

export default CapitalCost;

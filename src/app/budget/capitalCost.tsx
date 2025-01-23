import { Button } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { api } from "~/trpc/react";

interface CapitalCostProps {
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

type TableData = Record<string, LevelData>;
interface totalschema {
  totalQ1: number
  totalQ2: number
  totalQ3: number
  totalQ4: number
}
const months = [
  "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar",
];

const CapitalCost: React.FC<CapitalCostProps> = ({ section, categoryId, budgetId, deptId, status }) => {
  const userData = useSession()
  const [totalQty, setTotalQty] = useState<totalschema>({
    totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0
  })
  const { data, refetch } = api.get.getSubCats.useQuery({ categoryId });
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
    if (categoriesBudgetDetails) {
      const totalQtyAfterBudgetDetails: totalschema = { totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0 }
      categoriesBudgetDetails.forEach((item) => {
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
      setTotalQty(totalQty)
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

  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="my-6 rounded-md bg-white shadow-lg">
      <details className="group mx-auto w-full overflow-hidden rounded bg-[#F5F5F5] shadow">
        <summary className="flex cursor-pointer items-center justify-between rounded-md border border-primary bg-primary/10 p-2 text-primary">
          <h1 className="uppercase">{section}</h1>
          <div className="flex items-center space-x-2">
            <p className="text-sm">Total Cost: Q1:{totalQty.totalQ1} Q2:{totalQty.totalQ2} Q3:{totalQty.totalQ3} Q4:{totalQty.totalQ4}</p>
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
                        disabled={(userData.data?.user.role == 1 && status == "draft") || (userData.data?.user.role == 2 && status != "draft")}
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
            categoriesBudgetDetails && categoriesBudgetDetails.length > 0 && (userData.data?.user.role == 1 && status != "draft") && (userData.data?.user.role != 1 && status == "draft") && <Button
              type="button"
              className="cursor-pointer !text-white !bg-primary px-2 !w-20 !text-lg border border-black !disabled:cursor-not-allowed"
              variant="soft"
              style={{ cursor: isSaveDisabled() ? "not-allowed" : "pointer" }}
              disabled={isSaveDisabled()}
              onClick={() => handleUpdate()}
            // Disable the button if input is empty
            >
              Edit
            </Button>}
          {categoriesBudgetDetails?.length == 0 && !categoriesBudgetDetails && (userData.data?.user.role == 1 && status != "draft") && (userData.data?.user.role != 1 && status == "draft") && <Button
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

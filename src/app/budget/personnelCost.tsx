import React, { useState, useEffect } from "react";
import { Button } from "@radix-ui/themes";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";

interface PersonnelCostProps {
  section: string;
  categoryId: number;
  deptId: string;
  budgetId: number;
}

interface LevelData {
  budgetDetailsId: number
  Count: string | number;
  [month: string]: string | number; // Allow dynamic keys for months
}

type TableData = Record<string, LevelData>;

// const salaryMap = [
//   { name: "Assistant", salary: 10000,id:7 ,level:1},
//   { name: "Associate", salary: 20000, id: 8, level: 2 },
//   { name: "Manager", salary: 30000, id: 9, level: 3 },
//   { name: "Senior Manager", salary: 40000, id: 10, level: 4 },
//   { name: "AVP", salary: 50000, id: 11, level: 5 },
//   { name: "VP", salary: 55000, id: 12, level: 6 },
//   { name: "SVP", salary: 30000, id: 13, level: 7 },
//   { name: "Others - Interns, Volunteers, PTCs", salary: 25000, id: 14, level: 8 },
// ];

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

const PersonnelCost: React.FC<PersonnelCostProps> = ({ section, categoryId, deptId ,budgetId}) => {
  const [tableData, setTableData] = useState<TableData>({});
  const userData = useSession()
  const { data: subCategories } = api.get.getSubCats.useQuery({ categoryId });
  const { data: categoriesBudgetDetails, isLoading: categoryDetailsLoading, error } = api.get.getCatsBudgetDetails.useQuery({
    budgetId,
    catId: categoryId,
    deptId: Number(deptId),
  });

  const { data: levelEmployeesCount } = api.get.getLevelStaffCount.useQuery(
    {
      deptId: Number(deptId),
    },
    {
      enabled:
        !categoryDetailsLoading &&
        (!!error || !categoriesBudgetDetails || categoriesBudgetDetails.length === 0),
    }
  );

  useEffect(() => {
    if (subCategories && levelEmployeesCount) {
      // Prepopulate tableData based on level employee counts and salary mapping
      const initialTableData: TableData = {};

      subCategories?.subCategories?.forEach((sub, index) => {
        const levelData = levelEmployeesCount?.find(
          (level) => level.level === index + 1 // Assuming levelId is in the same order
        );

        const employeeCount = levelData ? levelData.employeeCount : 0;

        // Find the salary for the subcategory
        // const salary = salaryMap.find(s => s.name === sub.subCategoryName)?.salary ?? 0;
        const salarySum = levelData?.salarySum ? Number(levelData?.salarySum) : 0;
        const epfSum = levelData?.epfSum?  Number(levelData?.epfSum) : 0;
        const insuranceSum = levelData?.insuranceSum? Number(levelData?.insuranceSum ) : 0;
        const pwgPldSum = levelData?.pgwPldSum ? Number(levelData?.pgwPldSum ): 0;
        const bonusSum = levelData?.bonusSum ? Number(levelData?.bonusSum ): 0;
        const gratuitySum = levelData?.gratuitySum ?  Number(levelData?.gratuitySum) : 0;
        console.log(salarySum, epfSum, insuranceSum, pwgPldSum, bonusSum, gratuitySum)
        console.log(salarySum + epfSum + insuranceSum)
        // Initialize level data with the correct employee count for Qty1, Qty2, Qty3, Qty4
        initialTableData[sub.subCategoryId] = {
          Count: employeeCount,
          Qty1: employeeCount,
          Qty2: employeeCount,
          Qty3: employeeCount,
          Qty4: employeeCount,
          Apr: salarySum + epfSum + insuranceSum,
          May: salarySum + epfSum + pwgPldSum,
          Jun: salarySum + epfSum,
          Jul: salarySum + epfSum,
          Aug: salarySum + epfSum + pwgPldSum,
          Sep: salarySum + epfSum,
          Oct: salarySum + epfSum,
          Nov: salarySum + epfSum + pwgPldSum,
          Dec: salarySum + epfSum,
          Jan: salarySum + epfSum + bonusSum,
          Feb: salarySum + epfSum + gratuitySum,
          Mar: salarySum + epfSum,
          budgetDetailsId: 0, // Default or placeholder value
        };
      });

      setTableData(initialTableData);
    }
  }, [subCategories, levelEmployeesCount]);

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
      activity: undefined,
      deptId: 9,
      clusterId: undefined,
      createdBy: userData.data?.user.id??1,
      createdAt: "2022-12-11",
      qty1: Number(data.Qty1),
      qty2: Number(data.Qty2),
      qty3: Number(data.Qty3),
      qty4: Number(data.Qty4),
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

  const handleInputChange = (
    subCategoryId: number,
    month: string,
    value: string
  ) => {
    setTableData((prev) => {
      const updatedData = { ...prev };
      const subCategoryData = updatedData[subCategoryId];
      // Ensure subCategoryData exists
      if (!subCategoryData) return updatedData;

      // Update the value for the given month
      subCategoryData[month] = value;

      // Check if it's a Qty field and recalculate corresponding months
      if (month === "Qty1" || month === "Qty2" || month === "Qty3" || month === "Qty4") {
        const qty = parseInt(value, 10) || 0; // Default to 0 if value is invalid

        if (month === "Qty1") {
          subCategoryData.Apr = qty <= 1 ? Number(subCategoryData.Apr) : Number(subCategoryData.Apr) + (Number(subCategoryData.Apr) / (qty -1)) ;
          subCategoryData.May = qty <= 1 ? Number(subCategoryData.May) : Number(subCategoryData.May) + (Number(subCategoryData.May) / (qty- 1));
          subCategoryData.Jun = qty <= 1 ? Number(subCategoryData.Jun) : Number(subCategoryData.Jun) + (Number(subCategoryData.Jun) / (qty- 1));
        }
        if (month === "Qty2") {
          subCategoryData.Jul = qty <= 1 ? Number(subCategoryData.Jul) : Number(subCategoryData.Jul) + (Number(subCategoryData.Jul) / (qty- 1));
          subCategoryData.Aug = qty <= 1 ? Number(subCategoryData.Aug) : Number(subCategoryData.Aug) + (Number(subCategoryData.Aug) / (qty- 1));
          subCategoryData.Sep = qty <= 1 ? Number(subCategoryData.Sep) : Number(subCategoryData.Sep) + (Number(subCategoryData.Sep) / (qty- 1));
        }
        if (month === "Qty3") {
          subCategoryData.Oct = qty <= 1 ? Number(subCategoryData.Oct) : Number(subCategoryData.Oct) + (Number(subCategoryData.Oct) / (qty- 1));
          subCategoryData.Nov = qty <= 1 ? Number(subCategoryData.Nov) : Number(subCategoryData.Nov) + (Number(subCategoryData.Nov) / (qty- 1));
          subCategoryData.Dec = qty <= 1 ? Number(subCategoryData.Dec) : Number(subCategoryData.Dec) + (Number(subCategoryData.Dec) / (qty- 1));
        }
        if (month === "Qty4") {
          subCategoryData.Jan = qty <= 1 ? Number(subCategoryData.Jan) : Number(subCategoryData.Jan) + (Number(subCategoryData.Jan) / (qty- 1));
          subCategoryData.Feb = qty <= 1 ? Number(subCategoryData.Feb) : Number(subCategoryData.Feb) + (Number(subCategoryData.Feb) / (qty- 1));
          subCategoryData.Mar = qty <= 1 ? Number(subCategoryData.Mar) : Number(subCategoryData.Mar) + (Number(subCategoryData.Mar) / (qty- 1));
        }

        // Update the count for this subcategory
        subCategoryData.Count = qty;

        updatedData[subCategoryId] = subCategoryData;
      }

      return updatedData;
    });
  };
  useEffect(() => {
    const initialData: TableData = {};
    if (subCategories?.subCategories) {
      subCategories.subCategories.forEach((sub) => {
        initialData[sub.subCategoryId] = {
          Count: "",
          Qty1: 0,
          Apr: "",
          May: "",
          Jun: "",
          Qty2: 0,
          Jul: "",
          Aug: "",
          Sep: "",
          Qty3: 0,
          Oct: "",
          Nov: "",
          Dec: "",
          Qty4: "",
          Jan: "",
          Feb: "",
          Mar: "",
          budgetDetailsId: 0
        };
      });
    }
    if (categoriesBudgetDetails) {
      categoriesBudgetDetails.forEach((item) => {
        initialData[item.subcategoryId] = {
          Count: item.total,
          Apr: item.april ? item.april : "",
          May: item.may ? item.may : "",
          Jun: item.june ? item.june : "",
          Jul: item.july ? item.july : "",
          Aug: item.august ? item.august : "",
          Sep: item.september ? item.september : "",
          Oct: item.october ? item.october : "",
          Nov: item.november ? item.november : "",
          Dec: item.december ? item.december : "",
          Jan: item.january ? item.january : "",
          Feb: item.february ? item.february : "",
          Mar: item.march ? item.march : "",
          Qty1: item.qty1 ? item.qty1 : "",
          Qty2: item.qty2 ? item.qty2 : "",
          Qty3: item.qty3 ? item.qty3 : "",
          Qty4: item.qty4 ? item.qty4 : "",
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

  const updateBudgetDetails = api.post.updateBudgetDetails.useMutation();
  const handleUpdate = async () => {
    const budgetDetails = Object.entries(tableData).map(([subCategoryId, data]) => ({
      budgetDetailsId: data.budgetDetailsId,
      catid: categoryId,
      subcategoryId: parseInt(subCategoryId, 10),
      // need to be removed
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
      clusterId: undefined,
      updatedBy: userData.data?.user.id ?? 1,
      updatedAt: new Date().toISOString(),
      rate1: (data.rate1 ?? "").toString(),
      rate2: (data.rate2 ?? "").toString(),
      rate3: (data.rate3 ?? "").toString(),
      rate4: (data.rate4 ?? "").toString(),
      amount1: ((data.amount1 ?? "").toString()),
      amount2: ((data.amount2 ?? "").toString()),
      amount3: ((data.amount3 ?? "").toString()),
      amount4: ((data.amount4 ?? "").toString()),
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
      <details className="group mx-auto w-full overflow-hidden rounded bg-[#F5F5F5] shadow transition-[max-height] duration-500">
        <summary className="flex cursor-pointer items-center justify-between rounded-md border border-primary bg-primary/10 p-2 text-primary outline-none">
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
                <th className="border p-2">Level</th>
                {months.map((month) => (
                  <th key={month} className="border p-2">
                    {month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subCategories?.subCategories
                ?.sort((a, b) => a.subCategoryId - b.subCategoryId)
                .map((sub) => (
                <tr key={sub.subCategoryId} className="text-sm transition hover:bg-gray-100">
                  <td className="border p-2 font-medium">{sub.subCategoryName}</td>
                  {months.map((month, idx) => (
                    <td key={month} className="border p-2">
                      <input
                        type={idx % 4 === 0 ? "number" : "text"}
                        className="w-full rounded border p-1"
                        disabled={idx % 4 !== 0}
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
              className="!cursor-pointer !text-white !bg-primary px-2 !w-20 !text-lg border border-black"
              variant="soft"
              onClick={() => handleUpdate()}
            >
              Edit
            </Button> : <Button
              type="button"
              className="!cursor-pointer !text-white !bg-primary px-2 !w-20 !text-lg border border-black"
              variant="soft"
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

export default PersonnelCost;

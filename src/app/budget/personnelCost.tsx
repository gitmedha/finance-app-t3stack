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

// trying to keep the avg values in case of needed 
interface qty {
  Apr: number
  May: number,
  Jun: number,
  Jul: number,
  Aug: number,
  Sep: number,
  Oct: number,
  Nov: number,
  Dec: number,
  Jan: number,
  Feb: number,
  Mar: number
}
type avgQtySchema = Record<string, qty>
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

const PersonnelCost: React.FC<PersonnelCostProps> = ({ section, categoryId, deptId, budgetId }) => {
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
  const [avgQty, setAvgQty] = useState<avgQtySchema>({})

  useEffect(() => {
    if (subCategories && levelEmployeesCount) {
      const initialTableData: TableData = {};
      const intialAvgQty: avgQtySchema = {}
      subCategories?.subCategories?.forEach((sub, index) => {
        const levelData = levelEmployeesCount?.find(
          (level) => level.level === index + 1
        );

        const employeeCount = levelData ? levelData.employeeCount : 0;
        const salarySum = levelData?.salarySum ? Number(levelData?.salarySum) : 0;
        const epfSum = levelData?.epfSum ? Number(levelData?.epfSum) : 0;
        const insuranceSum = levelData?.insuranceSum ? Number(levelData?.insuranceSum) : 0;
        const pwgPldSum = levelData?.pgwPldSum ? Number(levelData?.pgwPldSum) : 0;
        const bonusSum = levelData?.bonusSum ? Number(levelData?.bonusSum) : 0;
        const gratuitySum = levelData?.gratuitySum ? Number(levelData?.gratuitySum) : 0;
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
        intialAvgQty[sub.subCategoryId] = {
          Apr: (salarySum + epfSum + insuranceSum)/employeeCount,
          May: (salarySum + epfSum + pwgPldSum) / employeeCount,
          Jun: (salarySum + epfSum) / employeeCount,
          Jul: (salarySum + epfSum) / employeeCount,
          Aug: (salarySum + epfSum + pwgPldSum) / employeeCount,
          Sep: (salarySum + epfSum) / employeeCount,
          Oct: (salarySum + epfSum) / employeeCount,
          Nov: (salarySum + epfSum + pwgPldSum) / employeeCount,
          Dec: (salarySum + epfSum) / employeeCount,
          Jan: (salarySum + epfSum + bonusSum) / employeeCount,
          Feb: (salarySum + epfSum + gratuitySum) / employeeCount,
          Mar: (salarySum + epfSum) / employeeCount,
        }
      });
      setAvgQty(intialAvgQty)
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
      createdBy: userData.data?.user.id ?? 1,
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
      if (!subCategoryData || !avgQty[subCategoryId]) return updatedData;

      // Update the value for the given month
      subCategoryData[month] = value;

      // Check if it's a Qty field and recalculate corresponding months
      if (month === "Qty1" || month === "Qty2" || month === "Qty3" || month === "Qty4") {
        const qty = parseInt(value, 10) || 0; // Default to 0 if value is invalid

        if (month === "Qty1") {
          subCategoryData.Apr = qty * avgQty[subCategoryId].Apr;
          subCategoryData.May = qty *avgQty[subCategoryId].May;
          subCategoryData.Jun = qty *avgQty[subCategoryId].Jun;
        }
        if (month === "Qty2") {
          subCategoryData.Jul = qty *avgQty[subCategoryId].Jul;
          subCategoryData.Aug = qty *avgQty[subCategoryId].Aug;
          subCategoryData.Sep = qty * avgQty[subCategoryId].Sep;
        }
        if (month === "Qty3") {
          subCategoryData.Oct = qty *avgQty[subCategoryId].Jan;
          subCategoryData.Nov = qty *avgQty[subCategoryId].Jan;
          subCategoryData.Dec = qty * avgQty[subCategoryId].Jan;
        }
        if (month === "Qty4") {
          subCategoryData.Jan = qty * avgQty[subCategoryId].Jan;
          subCategoryData.Feb = qty *avgQty[subCategoryId].Feb;
          subCategoryData.Mar = qty * avgQty[subCategoryId].Mar;
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
    const intialAvgQty: avgQtySchema = {}
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
        intialAvgQty[sub.subCategoryId] = {
          Apr: 0,
          May: 0,
          Jun: 0,
          Jul: 0,
          Aug: 0,
          Sep: 0,
          Oct: 0,
          Nov: 0,
          Dec: 0,
          Jan: 0,
          Feb: 0,
          Mar: 0,
        }
      });
      
    }
    if (categoriesBudgetDetails) {
      categoriesBudgetDetails.forEach((item) => {
        initialData[item.subcategoryId] = {
          Count: item.total,
          Apr: item.april ? item.april : "0",
          May: item.may ? item.may : "0",
          Jun: item.june ? item.june : "0",
          Jul: item.july ? item.july : "",
          Aug: item.august ? item.august : "0",
          Sep: item.september ? item.september : "0",
          Oct: item.october ? item.october : "0",
          Nov: item.november ? item.november : "0",
          Dec: item.december ? item.december : "0",
          Jan: item.january ? item.january : "0",
          Feb: item.february ? item.february : "0",
          Mar: item.march ? item.march : "0",
          Qty1: item.qty1 ? item.qty1 : 0,
          Qty2: item.qty2 ? item.qty2 : 0,
          Qty3: item.qty3 ? item.qty3 : 0,
          Qty4: item.qty4 ? item.qty4 : 0,
          budgetDetailsId: item.id
        };
        intialAvgQty[item.subcategoryId] = {
          Apr: Number(item.april)/(item.qty1 ? item.qty1 : 1),
          May: Number(item.may) / (item.qty1 ? item.qty1 : 1),
          Jun: Number(item.june) / (item.qty1 ? item.qty1 : 1),
          Jul: Number(item.july) / (item.qty2 ? item.qty2 : 1),
          Aug: Number(item.august) / (item.qty2 ? item.qty2 : 1),
          Sep: Number(item.september) / (item.qty2 ? item.qty2 : 1),
          Oct: Number(item.october) / (item.qty3 ? item.qty3 : 1),
          Nov: Number(item.november) / (item.qty3 ? item.qty3 : 1),
          Dec: Number(item.december) / (item.qty3 ? item.qty3: 1),
          Jan: Number(item.january) / (item.qty4 ? item.qty4 : 1),
          Feb: Number(item.february) / (item.qty4 ? item.qty4 : 1),
          Mar: Number(item.march) / (item.qty4 ? item.qty4 : 1),
        }
        if (item.qty1 == 0 || !item.qty1)
        {
          const aprIn = document.getElementById(item.subcategoryId + "Apr") as HTMLInputElement;
          const mayIn = document.getElementById(item.subcategoryId + "May") as HTMLInputElement;
          const junIn = document.getElementById(item.subcategoryId + "Jun") as HTMLInputElement;
          if (aprIn && mayIn && junIn) {
            aprIn.disabled = false;
            mayIn.disabled = false;
            junIn.disabled = false;
          } else {
            console.error(`Input element with ID  not found.`);
          }
        }
        if (item.qty2 == 0 || !item.qty2) {
          const julIn = document.getElementById(item.subcategoryId + "Jul") as HTMLInputElement;
          const augIn = document.getElementById(item.subcategoryId + "Aug") as HTMLInputElement;
          const sepIn = document.getElementById(item.subcategoryId + "Sep") as HTMLInputElement;
          if (julIn && augIn && sepIn) {
            julIn.disabled = false;
            augIn.disabled = false;
            sepIn.disabled = false;
          } else {
            console.error(`Input element with ID  not found.`);
          }          
        }
        if (item.qty3 == 0 || !item.qty3) {
          const octIn = document.getElementById(item.subcategoryId + "Oct") as HTMLInputElement;
          const novIn = document.getElementById(item.subcategoryId + "Nov") as HTMLInputElement;
          const decIn = document.getElementById(item.subcategoryId + "Dec") as HTMLInputElement;
          if (octIn && novIn && decIn) {
            octIn.disabled = false;
            novIn.disabled = false;
            decIn.disabled = false;
          } else {
            console.error(`Input element with ID  not found.`);
          }
        }
        if (item.qty4 == 0 || !item.qty4) {
          const janIn = document.getElementById(item.subcategoryId + "Jan") as HTMLInputElement;
          const febIn = document.getElementById(item.subcategoryId + "Feb") as HTMLInputElement;
          const marIn = document.getElementById(item.subcategoryId + "Mar") as HTMLInputElement;
          if (janIn && febIn && marIn) {
            janIn.disabled = false;
            febIn.disabled = false;
            marIn.disabled = false;
          } else {
            console.error(`Input element with ID  not found.`);
          }
        }
      });
      setAvgQty(intialAvgQty)
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
      qty4: Number(data.Qty4),
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
                          id ={sub.subCategoryId+month}
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

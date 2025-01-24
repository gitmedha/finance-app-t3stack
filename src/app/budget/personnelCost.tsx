import React, { useState, useEffect } from "react";
import { Button } from "@radix-ui/themes";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";

interface PersonnelCostProps {
  section: string;
  categoryId: number;
  deptId: string;
  budgetId: number;
  status: string | undefined
}

interface LevelData {
  budgetDetailsId: number
  Count: string | number;
  [month: string]: string | number; // Allow dynamic keys for months
}

type TableData = Record<string, LevelData>;

// trying to keep the avg values in case of needed 
interface qtySchema {
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
interface totalschema {
  totalQ1: number
  totalQ2: number
  totalQ3: number
  totalQ4: number
}
type avgQtySchema = Record<string, qtySchema>
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

const PersonnelCost: React.FC<PersonnelCostProps> = ({ section, categoryId, deptId, budgetId, status }) => {
  const [totalQty, setTotalQty] = useState<totalschema>({
    totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0
  })
  const [tableData, setTableData] = useState<TableData>({});
  const userData = useSession()
  // const { data: subCategories,isLoading:subcategoryLoading } = api.get.getSubCats.useQuery({ categoryId });
  // const { data: categoriesBudgetDetails, isLoading: categoryDetailsLoading, error:categoryDetailsError } = api.get.getCatsBudgetDetails.useQuery({
  //   budgetId,
  //   catId: categoryId,
  //   deptId: Number(deptId),
  // }
  //   ,
  //   {
  //     enabled: !!subCategories ,
  //   }
  // );
  const { data: personnelCostData, isLoading: personnelCostDataLodaing } = api.get.getPersonalCatDetials.useQuery({
    budgetId,
    catId: categoryId,
    deptId: Number(deptId),
  })
  // const { data: levelEmployeesCount } = api.get.getLevelStaffCount.useQuery(
  //   {
  //     deptId: Number(deptId),
  //   },
  //   {
  //     enabled:
  //       ((categoriesBudgetDetails?.result.length === 0 || !!categoryDetailsError) && !!subCategories && !subcategoryLoading ),
  //   }
  // );
  const [avgQty, setAvgQty] = useState<avgQtySchema>({})

  useEffect(()=>{
    if (personnelCostData?.budgetId == budgetId )
    {
      const initialData: TableData = {};
      const intialAvgQty: avgQtySchema = {}
      if (personnelCostData?.subCategories) {
        // console.log("After getting the subcategories")
        personnelCostData.subCategories.forEach((sub) => {
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
        if (personnelCostData.result && personnelCostData.result.length > 0) {
          // console.log("After getting the categorydetails")
          const totalQtyAfterBudgetDetails: totalschema = { totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0 }
          personnelCostData.result.forEach((item) => {
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
              Qty1: item.qty1 ? Number(item.qty1) : 0,
              Qty2: item.qty2 ? Number(item.qty2) : 0,
              Qty3: item.qty3 ? Number(item.qty3) : 0,
              Qty4: item.qty4 ? Number(item.qty4) : 0,
              budgetDetailsId: Number(item.id)
            };
            intialAvgQty[item.subcategoryId] = {
              Apr: Number(item.april) / (item.qty1 ? Number(item.qty1) : 1),
              May: Number(item.may) / (item.qty1 ? Number(item.qty1) : 1),
              Jun: Number(item.june) / (item.qty1 ? Number(item.qty1) : 1),
              Jul: Number(item.july) / (item.qty2 ? Number(item.qty2) : 1),
              Aug: Number(item.august) / (item.qty2 ? Number(item.qty2) : 1),
              Sep: Number(item.september) / (item.qty2 ? Number(item.qty2) : 1),
              Oct: Number(item.october) / (item.qty3 ? Number(item.qty3) : 1),
              Nov: Number(item.november) / (item.qty3 ? Number(item.qty3) : 1),
              Dec: Number(item.december) / (item.qty3 ? Number(item.qty3) : 1),
              Jan: Number(item.january) / (item.qty4 ? Number(item.qty4) : 1),
              Feb: Number(item.february) / (item.qty4 ? Number(item.qty4) : 1),
              Mar: Number(item.march) / (item.qty4 ? Number(item.qty4) : 1),
            }
            totalQtyAfterBudgetDetails.totalQ1 += Number(item.april) + Number(item.may) + Number(item.june)
            totalQtyAfterBudgetDetails.totalQ2 += Number(item.july) + Number(item.august) + Number(item.september)
            totalQtyAfterBudgetDetails.totalQ3 += Number(item.october) + Number(item.november) + Number(item.december)
            totalQtyAfterBudgetDetails.totalQ4 += Number(item.january) + Number(item.february) + Number(item.march)
            if ((item.qty1 == 0 || !item.qty1) && ((userData.data?.user.role == 1 && status != "draft") || (userData.data?.user.role == 2 && status == "draft"))) {
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
            if ((item.qty2 == 0 || !item.qty2) && ((userData.data?.user.role == 1 && status != "draft") || (userData.data?.user.role == 2 && status == "draft"))) {
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
            if ((item.qty3 == 0 || !item.qty3) && ((userData.data?.user.role == 1 && status != "draft") || (userData.data?.user.role == 2 && status == "draft"))) {
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
            if ((item.qty4 == 0 || !item.qty4) && ((userData.data?.user.role == 1 && status != "draft") || (userData.data?.user.role == 2 && status == "draft"))) {
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
          setTotalQty(totalQtyAfterBudgetDetails)
        }
        // else {
        //   setTableData({});
        // }
        else if (personnelCostData.levelStats) {
          console.log("After getting the level count")
          const totalQtyAfterStaffCount: totalschema = { totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0 }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          personnelCostData.subCategories.forEach((sub, index) => {
            const levelData = personnelCostData.levelStats?.find(
              (level) => level.level === sub.subCategoryId
            );
            const employeeCount = levelData ? levelData.employeeCount : 0;
            const salarySum = levelData?.salarySum ? Number(levelData?.salarySum) : 0;
            const epfSum = levelData?.epfSum ? Number(levelData?.epfSum) : 0;
            const insuranceSum = levelData?.insuranceSum ? Number(levelData?.insuranceSum) : 0;
            const pwgPldSum = levelData?.pgwPldSum ? Number(levelData?.pgwPldSum) : 0;
            const bonusSum = levelData?.bonusSum ? Number(levelData?.bonusSum) : 0;
            const gratuitySum = levelData?.gratuitySum ? Number(levelData?.gratuitySum) : 0;
            initialData[sub.subCategoryId] = {
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
              Apr: (salarySum + epfSum + insuranceSum) / employeeCount,
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
            totalQtyAfterStaffCount.totalQ1 += salarySum + epfSum + insuranceSum + salarySum + epfSum + pwgPldSum + salarySum + epfSum
            totalQtyAfterStaffCount.totalQ2 += salarySum + epfSum + salarySum + epfSum + pwgPldSum + salarySum + epfSum
            totalQtyAfterStaffCount.totalQ3 += salarySum + epfSum + salarySum + epfSum + pwgPldSum + salarySum + epfSum
            totalQtyAfterStaffCount.totalQ4 += salarySum + epfSum + bonusSum + salarySum + epfSum + gratuitySum + salarySum + epfSum
          });
          setAvgQty(intialAvgQty)
          setTableData(initialData);
          setTotalQty(totalQtyAfterStaffCount)
        }

      }
      
      // if we get the subcategories and the staff count
      
    }

    // this one if we get the subcategories and the category details
    
  },[personnelCostData])
  // useEffect(() => {
  //   if (subCategories && levelEmployeesCount) {
  //     console.log("After getting the level count")
  //     const initialTableData: TableData = {};
  //     const intialAvgQty: avgQtySchema = {}
  //     const totalQtyAfterStaffCount: totalschema = { totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0 }
  //     subCategories?.subCategories?.forEach((sub, index) => {
  //       const levelData = levelEmployeesCount?.find(
  //         (level) => level.level === sub.subCategoryId
  //       );
  //       const employeeCount = levelData ? levelData.employeeCount : 0;
  //       const salarySum = levelData?.salarySum ? Number(levelData?.salarySum) : 0;
  //       const epfSum = levelData?.epfSum ? Number(levelData?.epfSum) : 0;
  //       const insuranceSum = levelData?.insuranceSum ? Number(levelData?.insuranceSum) : 0;
  //       const pwgPldSum = levelData?.pgwPldSum ? Number(levelData?.pgwPldSum) : 0;
  //       const bonusSum = levelData?.bonusSum ? Number(levelData?.bonusSum) : 0;
  //       const gratuitySum = levelData?.gratuitySum ? Number(levelData?.gratuitySum) : 0;
  //       initialTableData[sub.subCategoryId] = {
  //         Count: employeeCount,
  //         Qty1: employeeCount,
  //         Qty2: employeeCount,
  //         Qty3: employeeCount,
  //         Qty4: employeeCount,
  //         Apr: salarySum + epfSum + insuranceSum,
  //         May: salarySum + epfSum + pwgPldSum,
  //         Jun: salarySum + epfSum,
  //         Jul: salarySum + epfSum,
  //         Aug: salarySum + epfSum + pwgPldSum,
  //         Sep: salarySum + epfSum,
  //         Oct: salarySum + epfSum,
  //         Nov: salarySum + epfSum + pwgPldSum,
  //         Dec: salarySum + epfSum,
  //         Jan: salarySum + epfSum + bonusSum,
  //         Feb: salarySum + epfSum + gratuitySum,
  //         Mar: salarySum + epfSum,
  //         budgetDetailsId: 0, // Default or placeholder value
  //       };
  //       intialAvgQty[sub.subCategoryId] = {
  //         Apr: (salarySum + epfSum + insuranceSum) / employeeCount,
  //         May: (salarySum + epfSum + pwgPldSum) / employeeCount,
  //         Jun: (salarySum + epfSum) / employeeCount,
  //         Jul: (salarySum + epfSum) / employeeCount,
  //         Aug: (salarySum + epfSum + pwgPldSum) / employeeCount,
  //         Sep: (salarySum + epfSum) / employeeCount,
  //         Oct: (salarySum + epfSum) / employeeCount,
  //         Nov: (salarySum + epfSum + pwgPldSum) / employeeCount,
  //         Dec: (salarySum + epfSum) / employeeCount,
  //         Jan: (salarySum + epfSum + bonusSum) / employeeCount,
  //         Feb: (salarySum + epfSum + gratuitySum) / employeeCount,
  //         Mar: (salarySum + epfSum) / employeeCount,
  //       }
  //       totalQtyAfterStaffCount.totalQ1 += salarySum + epfSum + insuranceSum + salarySum + epfSum + pwgPldSum + salarySum + epfSum
  //       totalQtyAfterStaffCount.totalQ2 += salarySum + epfSum + salarySum + epfSum + pwgPldSum + salarySum + epfSum
  //       totalQtyAfterStaffCount.totalQ3 += salarySum + epfSum + salarySum + epfSum + pwgPldSum + salarySum + epfSum
  //       totalQtyAfterStaffCount.totalQ4 += salarySum + epfSum + bonusSum + salarySum + epfSum + gratuitySum + salarySum + epfSum
  //     });
  //     setAvgQty(intialAvgQty)
  //     setTableData(initialTableData);
  //     setTotalQty(totalQtyAfterStaffCount)
  //   }
  // }, [subCategories, levelEmployeesCount]);

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
    value: string
  ) => {
    setTableData((prev) => {
      const updatedData = { ...prev };
      const subCategoryData = updatedData[subCategoryId];
      if (!subCategoryData || !avgQty[subCategoryId]) return updatedData;

      if (month == "Apr" || month == "May" || month == "Jun") {
        const diff = Number(subCategoryData[month]) - Number(value)
        updateTotalQtyVals("totalQ1", diff)
      }
      if (month == "Jul" || month == "Aug" || month == "Sep") {
        const diff = Number(subCategoryData[month]) - Number(value)
        console.log(diff)
        updateTotalQtyVals("totalQ2", diff)
      }
      if (month == "Oct" || month == "Nov" || month == "Dec") {
        const diff = Number(subCategoryData[month]) - Number(value)
        updateTotalQtyVals("totalQ3", diff)
      }
      if (month == "Jan" || month == "Feb" || month == "Mar") {
        const diff = Number(value) - Number(subCategoryData[month])
        updateTotalQtyVals("totalQ4", diff)
      }
      if (month === "Qty1" || month === "Qty2" || month === "Qty3" || month === "Qty4") {
        const qty = parseInt(value, 10) || 0;

        if (month === "Qty1") {
          const aprDiff = qty * avgQty[subCategoryId].Apr - Number(subCategoryData.Apr)
          const mayDiff = qty * avgQty[subCategoryId].May - Number(subCategoryData.May)
          const jubDiff = qty * avgQty[subCategoryId].Jun - Number(subCategoryData.Jun)
          updateTotalQtyVals("totalQ1", aprDiff)
          updateTotalQtyVals("totalQ1", mayDiff)
          updateTotalQtyVals("totalQ1", jubDiff)
          subCategoryData.Apr = qty * avgQty[subCategoryId].Apr;
          subCategoryData.May = qty * avgQty[subCategoryId].May;
          subCategoryData.Jun = qty * avgQty[subCategoryId].Jun;
        }
        if (month === "Qty2") {
          const julDiff = qty * avgQty[subCategoryId].Jul - Number(subCategoryData.Jul)
          const augDiff = qty * avgQty[subCategoryId].Aug - Number(subCategoryData.Aug)
          const sepDiff = qty * avgQty[subCategoryId].Sep - Number(subCategoryData.Sep)
          updateTotalQtyVals("totalQ2", julDiff)
          updateTotalQtyVals("totalQ2", augDiff)
          updateTotalQtyVals("totalQ2", sepDiff)
          subCategoryData.Jul = qty * avgQty[subCategoryId].Jul;
          subCategoryData.Aug = qty * avgQty[subCategoryId].Aug;
          subCategoryData.Sep = qty * avgQty[subCategoryId].Sep;
        }
        if (month === "Qty3") {
          const julDiff = qty * avgQty[subCategoryId].Oct - Number(subCategoryData.Oct)
          const augDiff = qty * avgQty[subCategoryId].Nov - Number(subCategoryData.Nov)
          const sepDiff = qty * avgQty[subCategoryId].Dec - Number(subCategoryData.Dec)
          updateTotalQtyVals("totalQ3", julDiff)
          updateTotalQtyVals("totalQ3", augDiff)
          updateTotalQtyVals("totalQ3", sepDiff)
          subCategoryData.Oct = qty * avgQty[subCategoryId].Jan;
          subCategoryData.Nov = qty * avgQty[subCategoryId].Jan;
          subCategoryData.Dec = qty * avgQty[subCategoryId].Jan;
        }
        if (month === "Qty4") {
          const julDiff = qty * avgQty[subCategoryId].Jan - Number(subCategoryData.Jan)
          const augDiff = qty * avgQty[subCategoryId].Feb - Number(subCategoryData.Feb)
          const sepDiff = qty * avgQty[subCategoryId].Mar - Number(subCategoryData.Mar)
          updateTotalQtyVals("totalQ4", julDiff)
          updateTotalQtyVals("totalQ4", augDiff)
          updateTotalQtyVals("totalQ4", sepDiff)
          subCategoryData.Jan = qty * avgQty[subCategoryId].Jan;
          subCategoryData.Feb = qty * avgQty[subCategoryId].Feb;
          subCategoryData.Mar = qty * avgQty[subCategoryId].Mar;
        }
        subCategoryData.Count = qty;
      }
      subCategoryData[month] = value;
      updatedData[subCategoryId] = subCategoryData;

      return updatedData;
    });
  };
  // useEffect(() => {
  //   const initialData: TableData = {};
  //   const intialAvgQty: avgQtySchema = {}
  //   if (subCategories?.subCategories) {
  //     console.log("After getting the subcategories")
  //     subCategories.subCategories.forEach((sub) => {
  //       initialData[sub.subCategoryId] = {
  //         Count: "",
  //         Qty1: 0,
  //         Apr: "",
  //         May: "",
  //         Jun: "",
  //         Qty2: 0,
  //         Jul: "",
  //         Aug: "",
  //         Sep: "",
  //         Qty3: 0,
  //         Oct: "",
  //         Nov: "",
  //         Dec: "",
  //         Qty4: "",
  //         Jan: "",
  //         Feb: "",
  //         Mar: "",
  //         budgetDetailsId: 0
  //       };
  //       intialAvgQty[sub.subCategoryId] = {
  //         Apr: 0,
  //         May: 0,
  //         Jun: 0,
  //         Jul: 0,
  //         Aug: 0,
  //         Sep: 0,
  //         Oct: 0,
  //         Nov: 0,
  //         Dec: 0,
  //         Jan: 0,
  //         Feb: 0,
  //         Mar: 0,
  //       }
  //     });

  //   }
  //   if (categoriesBudgetDetails && categoriesBudgetDetails.result.length>0) {
  //     console.log("After getting the categorydetails")
  //     const totalQtyAfterBudgetDetails: totalschema = { totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0 }
  //     categoriesBudgetDetails.result.forEach((item) => {
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
  //         Qty1: item.qty1 ? Number(item.qty1) : 0,
  //         Qty2: item.qty2 ? Number(item.qty2) : 0,
  //         Qty3: item.qty3 ? Number(item.qty3) : 0,
  //         Qty4: item.qty4 ? Number(item.qty4) : 0,
  //         budgetDetailsId: Number(item.id)
  //       };
  //       intialAvgQty[item.subcategoryId] = {
  //         Apr: Number(item.april) / (item.qty1 ? Number(item.qty1) : 1),
  //         May: Number(item.may) / (item.qty1 ? Number(item.qty1) : 1),
  //         Jun: Number(item.june) / (item.qty1 ? Number(item.qty1) : 1),
  //         Jul: Number(item.july) / (item.qty2 ? Number(item.qty2) : 1),
  //         Aug: Number(item.august) / (item.qty2 ? Number(item.qty2) : 1),
  //         Sep: Number(item.september) / (item.qty2 ? Number(item.qty2) : 1),
  //         Oct: Number(item.october) / (item.qty3 ? Number(item.qty3) : 1),
  //         Nov: Number(item.november) / (item.qty3 ? Number(item.qty3) : 1),
  //         Dec: Number(item.december) / (item.qty3 ? Number(item.qty3) : 1),
  //         Jan: Number(item.january) / (item.qty4 ? Number(item.qty4) : 1),
  //         Feb: Number(item.february) / (item.qty4 ? Number(item.qty4) : 1),
  //         Mar: Number(item.march) / (item.qty4 ? Number(item.qty4) : 1),
  //       }
  //       totalQtyAfterBudgetDetails.totalQ1 += Number(item.april) + Number(item.may) + Number(item.june)
  //       totalQtyAfterBudgetDetails.totalQ2 += Number(item.july) + Number(item.august) + Number(item.september)
  //       totalQtyAfterBudgetDetails.totalQ3 += Number(item.october) + Number(item.november) + Number(item.december)
  //       totalQtyAfterBudgetDetails.totalQ4 += Number(item.january) + Number(item.february) + Number(item.march)
  //       if (item.qty1 == 0 || !item.qty1 && ((userData.data?.user.role == 1 && status != "draft") || (userData.data?.user.role == 2 && status == "draft"))) {
  //         const aprIn = document.getElementById(item.subcategoryId + "Apr") as HTMLInputElement;
  //         const mayIn = document.getElementById(item.subcategoryId + "May") as HTMLInputElement;
  //         const junIn = document.getElementById(item.subcategoryId + "Jun") as HTMLInputElement;
  //         if (aprIn && mayIn && junIn) {
  //           aprIn.disabled = false;
  //           mayIn.disabled = false;
  //           junIn.disabled = false;
  //         } else {
  //           console.error(`Input element with ID  not found.`);
  //         }
  //       }
  //       if (item.qty2 == 0 || !item.qty2 && ((userData.data?.user.role == 1 && status != "draft") || (userData.data?.user.role == 2 && status == "draft"))) {
  //         const julIn = document.getElementById(item.subcategoryId + "Jul") as HTMLInputElement;
  //         const augIn = document.getElementById(item.subcategoryId + "Aug") as HTMLInputElement;
  //         const sepIn = document.getElementById(item.subcategoryId + "Sep") as HTMLInputElement;
  //         if (julIn && augIn && sepIn) {
  //           julIn.disabled = false;
  //           augIn.disabled = false;
  //           sepIn.disabled = false;
  //         } else {
  //           console.error(`Input element with ID  not found.`);
  //         }
  //       }
  //       if (item.qty3 == 0 || !item.qty3 && ((userData.data?.user.role == 1 && status != "draft") || (userData.data?.user.role == 2 && status == "draft"))) {
  //         const octIn = document.getElementById(item.subcategoryId + "Oct") as HTMLInputElement;
  //         const novIn = document.getElementById(item.subcategoryId + "Nov") as HTMLInputElement;
  //         const decIn = document.getElementById(item.subcategoryId + "Dec") as HTMLInputElement;
  //         if (octIn && novIn && decIn) {
  //           octIn.disabled = false;
  //           novIn.disabled = false;
  //           decIn.disabled = false;
  //         } else {
  //           console.error(`Input element with ID  not found.`);
  //         }
  //       }
  //       if (item.qty4 == 0 || !item.qty4 && ((userData.data?.user.role == 1 && status != "draft") || (userData.data?.user.role == 2 && status == "draft"))) {
  //         const janIn = document.getElementById(item.subcategoryId + "Jan") as HTMLInputElement;
  //         const febIn = document.getElementById(item.subcategoryId + "Feb") as HTMLInputElement;
  //         const marIn = document.getElementById(item.subcategoryId + "Mar") as HTMLInputElement;
  //         if (janIn && febIn && marIn) {
  //           janIn.disabled = false;
  //           febIn.disabled = false;
  //           marIn.disabled = false;
  //         } else {
  //           console.error(`Input element with ID  not found.`);
  //         }
  //       }
  //     });
  //     setAvgQty(intialAvgQty)
  //     setTableData(initialData);
  //     setTotalQty(totalQtyAfterBudgetDetails)
  //   }
  //   else {
  //     setTableData({});
  //   }
  // }, [categoriesBudgetDetails]);

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
  
    <div className="my-6 rounded-md bg-white shadow-lg">{personnelCostData?.budgetId}
    {/* {categoriesBudgetDetails && categoriesBudgetDetails.result.length > 0 && "data from the category details"} */}
      <details className="group mx-auto w-full overflow-hidden rounded bg-[#F5F5F5] shadow transition-[max-height] duration-500">
        <summary className="flex cursor-pointer items-center justify-between rounded-md border border-primary bg-primary/10 p-2 text-primary outline-none">
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
                <th className="border p-2">Level</th>
                {months.map((month) => (
                  <th key={month} className="border p-2">
                    {month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {personnelCostData?.subCategories
                ?.sort((a, b) => a.subCategoryId - b.subCategoryId)
                .map((sub) => (
                  <tr key={sub.subCategoryId} className="text-sm transition hover:bg-gray-100">
                    <td className="border p-2 font-medium">{sub.subCategoryName}</td>
                    {months.map((month, idx) => (
                      <td key={month} className="border p-2">
                        <input
                          type={idx % 4 === 0 ? "number" : "text"}
                          className="w-full rounded border p-1"
                          disabled={(idx % 4 !== 0 )|| (userData.data?.user.role == 1 && status == "draft") || (userData.data?.user.role == 2 && status != "draft")}
                          value={tableData[sub.subCategoryId]?.[month] ?? ""}
                          id={sub.subCategoryId + month}
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
            personnelCostData?.result && personnelCostData.result.length > 0 ? <Button
              type="button"
              className="!cursor-pointer !text-white !bg-primary px-2 !w-20 !text-lg border border-black"
              variant="soft"
              onClick={() => handleUpdate()}
            >
              Edit
            </Button>:<Button
              type="button"
              className="!cursor-pointer !text-white !bg-primary px-2 !w-20 !text-lg border border-black"
              variant="soft"
              onClick={() => handleSave()}
            >
            Save
          </Button>
          }
          {/* {
          personnelCostData?.result.length == 0 && !personnelCostData && (userData.data?.user.role == 1 && status != "draft") && (userData.data?.user.role != 1 && status == "draft") &&      && (userData.data?.user.role == 1 && status != "draft") && (userData.data?.user.role != 1 && status == "draft") &&
          } */}

        </div>
      </details>
    </div>
  );
};

export default PersonnelCost;
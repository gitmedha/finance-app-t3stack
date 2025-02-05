import React, { useState, useEffect } from "react";
import { Button } from "@radix-ui/themes";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import {  toast } from 'react-toastify';
interface PersonnelCostProps {
  section: string;
  categoryId: number;
  deptId: string;
  budgetId: number;
  status: string | undefined
  sectionOpen: null | "PERSONNEL" | "Program Activities" | "Travel" | "PROGRAM OFFICE" | "CAPITAL COST" | "OVERHEADS"
  setSectionOpen: (val: null | "PERSONNEL" | "Program Activities" | "Travel" | "PROGRAM OFFICE" | "CAPITAL COST" | "OVERHEADS") => void
  travelCatId:number
  subdepartmentId:number
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

const PersonnelCost: React.FC<PersonnelCostProps> = ({ section, categoryId, deptId, budgetId, status, sectionOpen, setSectionOpen, travelCatId, subdepartmentId }) => {
  const [saveBtnState, setSaveBtnState] = useState<"loading" | "edit" | "save">("loading")
  const [totalQty, setTotalQty] = useState<totalschema>({
    totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0
  })
  const [inputStates, setInputStates] = useState<boolean>(true)
  const [tableData, setTableData] = useState<TableData>({});
  const userData = useSession()
  const { data: personnelCostData, isLoading: personnelCostDataLodaing } = api.get.getPersonalCatDetials.useQuery(
    {
    subdeptId:subdepartmentId,
    budgetId,
    catId: categoryId,
    deptId: Number(deptId),
  }, {
    refetchOnMount: false,
    refetchOnWindowFocus:false,
    staleTime: 0, 
  },)
  const handelnputDisable = (disable: boolean) => {
    const subcategoryIds = []
    setInputStates(disable)
    for (const [subcategoryId, subcategoryData] of Object.entries(tableData)) {
      subcategoryIds.push(subcategoryId)
    }
    subcategoryIds.forEach((id) => {
      const subCatData = tableData[id]
      const qty1Val = subCatData?.Qty1 ?? 0
      const qty2Val = subCatData?.Qty2 ?? 0
      const qty3Val = subCatData?.Qty3 ?? 0
      const qty4Val = subCatData?.Qty4 ?? 0
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
      if (aprIn && mayIn && junIn && julIn && augIn && sepIn && octIn && novIn && decIn && janIn && febIn && marIn &&  qty1In && qty2In && qty3In && qty4In) {
        if(disable)
        {
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
        }
        else{
          qty1In.disabled = disable;
          qty2In.disabled = disable;
          qty3In.disabled = disable;
          qty4In.disabled = disable;
          if (qty1Val == 0)
          {
            aprIn.disabled = disable;
            mayIn.disabled = disable;
            junIn.disabled = disable;
          }
          if(qty2Val == 0)
          {
            julIn.disabled = disable;
            augIn.disabled = disable;
            sepIn.disabled = disable;
          }
          if(qty3Val == 0){
            octIn.disabled = disable;
            novIn.disabled = disable;
            decIn.disabled = disable;
          }
          if(qty4Val == 0)
          {
            janIn.disabled = disable;
            febIn.disabled = disable;
            marIn.disabled = disable;
          }
        }
        
      } else {
        console.error(`Input element with ID  not found.`);
      }
    })
  }
  const [avgQty, setAvgQty] = useState<avgQtySchema>({})
  const isSaveDisabled = () => {
    return Object.values(tableData).some((subData) => {
      return months.some((month) => {
        return !subData[month]?.toString().trim();
      });
    });
  };

  useEffect(()=>{
    if (personnelCostData?.budgetId == budgetId )
    {
      const initialData: TableData = {};
      const intialAvgQty: avgQtySchema = {}
      if (personnelCostData?.subCategories) {
        personnelCostData.subCategories.forEach((sub) => {
          initialData[sub.subCategoryId] = {
            Count: "0",
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
            Qty4: 0,
            Jan: "0",
            Feb: "0",
            Mar: "0",
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
          setAvgQty(intialAvgQty)
          setTableData(initialData);
        });
        if (personnelCostData.result && personnelCostData.result.length > 0) {
          setSaveBtnState("edit")
          console.log("Am i hitting this or not ")
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
          });
          setAvgQty(intialAvgQty)
          setTableData(initialData);
          setTotalQty(totalQtyAfterBudgetDetails)
        }
        else if (personnelCostData.levelStats) {
          setSaveBtnState("save")
          const totalQtyAfterStaffCount: totalschema = { totalQ1: 0, totalQ2: 0, totalQ3: 0, totalQ4: 0 }
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
              Apr: employeeCount!=0 ? (salarySum + epfSum + insuranceSum) / employeeCount : 0,
              May: employeeCount != 0 ?(salarySum + epfSum + pwgPldSum) / employeeCount:0,
              Jun: employeeCount != 0 ?(salarySum + epfSum) / employeeCount:0,
              Jul: employeeCount != 0 ?(salarySum + epfSum) / employeeCount:0,
              Aug: employeeCount != 0 ?(salarySum + epfSum + pwgPldSum) / employeeCount:0,
              Sep: employeeCount != 0 ?(salarySum + epfSum) / employeeCount:0,
              Oct: employeeCount != 0 ?(salarySum + epfSum) / employeeCount:0,
              Nov: employeeCount != 0 ?(salarySum + epfSum + pwgPldSum) / employeeCount:0,
              Dec: employeeCount != 0 ?(salarySum + epfSum) / employeeCount:0,
              Jan: employeeCount != 0 ?(salarySum + epfSum + bonusSum) / employeeCount:0,
              Feb: employeeCount != 0 ?(salarySum + epfSum + gratuitySum) / employeeCount:0,
              Mar: employeeCount != 0 ?(salarySum + epfSum) / employeeCount:0,
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
    }    
  },[personnelCostData])
  const createBudgetDetails = api.post.savePersonalBudgetDetails.useMutation();
  const handleSave = async () => {
    setSaveBtnState("loading")
    const budgetDetails = Object.entries(tableData).map(([subCategoryId, data]) => ({
      budgetid: budgetId,
      catid: categoryId,
      subcategoryId: parseInt(subCategoryId, 10),
      subDeptId: subdepartmentId ,
      unit: 1,
      rate: "1",
      total: "1",
      currency: "INR",
      notes: "",
      description: "",
      april: (data.Apr ?? "0").toString(),
      may: (data.May ?? "0").toString(),
      june: (data.Jun ?? "0").toString(),
      july: (data.Jul ?? "0").toString(),
      august: (data.Aug ?? "0").toString(),
      september: (data.Sep ?? "0").toString(),
      october: (data.Oct ?? "0").toString(),
      november: (data.Nov ?? "0").toString(),
      december: (data.Dec ?? "0").toString(),
      january: (data.Jan ?? "0").toString(),
      february: (data.Feb ?? "0").toString(),
      march: (data.Mar ?? "0").toString(),
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
          travelCatId,
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
        console.log(Number(value))
        console.log(Number(subCategoryData[month]))
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
      if (month === "Qty1" || month === "Qty2" || month === "Qty3" || month === "Qty4") {
        const qty = parseInt(value, 10) || 0;

        if (month === "Qty1") {
          const aprDiff = qty * avgQty[subCategoryId].Apr-Number(subCategoryData.Apr) 
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
          subCategoryData.Oct = qty * avgQty[subCategoryId].Oct;
          subCategoryData.Nov = qty * avgQty[subCategoryId].Nov;
          subCategoryData.Dec = qty * avgQty[subCategoryId].Dec;
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
  
  const updateBudgetDetails = api.post.updatePersonalBudgetDetails.useMutation();
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
      april: (data.Apr ?? "0").toString(),
      may: (data.May ?? "0").toString(),
      june: (data.Jun ?? "0").toString(),
      july: (data.Jul ?? "0").toString(),
      august: (data.Aug ?? "0").toString(),
      september: (data.Sep ?? "0").toString(),
      october: (data.Oct ?? "0").toString(),
      november: (data.Nov ?? "0").toString(),
      december: (data.Dec ?? "0").toString(),
      january: (data.Jan ?? "0").toString(),
      february: (data.Feb ?? "0").toString(),
      march: (data.Mar ?? "0").toString(),
      clusterId: undefined,
      updatedBy: userData.data?.user.id ?? 1,
      updatedAt: new Date().toISOString(),
      rate1: (data.rate1 ?? "0").toString(),
      rate2: (data.rate2 ?? "0").toString(),
      rate3: (data.rate3 ?? "0").toString(),
      rate4: (data.rate4 ?? "0").toString(),
      amount1: ((data.amount1 ?? "0").toString()),
      amount2: ((data.amount2 ?? "0").toString()),
      amount3: ((data.amount3 ?? "0").toString()),
      amount4: ((data.amount4 ?? "0").toString()),
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
          travelCatId,
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
      console.error("Failed to update budget details:", error);
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
    } finally {
      setSaveBtnState("edit")
    }
  };
  return (
  
    <div className="my-6 rounded-md bg-white shadow-lg">
      <details className="group mx-auto w-full overflow-hidden rounded bg-[#F5F5F5] shadow transition-[max-height] duration-500"
        open={sectionOpen == "PERSONNEL"}
        onClick={(e) => {
          e.preventDefault()
        }}>
        <summary className="flex cursor-pointer items-center justify-between rounded-md border border-primary bg-primary/10 p-2 text-primary outline-none"
          onClick={(e) => {
            e.preventDefault()
            if (sectionOpen == "PERSONNEL")
              setSectionOpen(null)
            else
              setSectionOpen("PERSONNEL")
          }}>
          <h1 className="uppercase">{section}</h1>
          {
            personnelCostDataLodaing ? <div className="flex items-center space-x-2">
              <p className="text-sm">Loading.....</p>
            </div> :
              <div className="flex items-center space-x-2">
                <p className="text-sm">Total Cost: Q1:{totalQty.totalQ1}, Q2:{totalQty.totalQ2}, Q3:{totalQty.totalQ3}, Q4:{totalQty.totalQ4}</p>
                <span className="text-lg font-bold transition-transform group-open:rotate-90">→</span>
              </div>
          }
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
                          disabled={true}
                          // disabled={(idx % 4 !== 0 )|| (userData.data?.user.role == 1 && status == "draft") || (userData.data?.user.role == 2 && status != "draft")}
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
        {
          ((userData.data?.user.role == 1 && status != "draft") || (userData.data?.user.role != 1 && status == "draft")) && <div className="py-2 pr-4 flex flex-row-reverse gap-2">
            {
              !inputStates && <div>
                {
                  saveBtnState == "loading" && <Button
                    type="button"
                    className=" !text-white !bg-primary px-2 !w-20 !text-lg border border-black !cursor-not-allowed"
                    variant="soft"
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
                  </Button>
                }
                {
                  saveBtnState == "save" && <Button
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

export default PersonnelCost;
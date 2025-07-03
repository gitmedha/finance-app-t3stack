"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
// import { BiComment } from "react-icons/bi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { api } from "~/trpc/react";
import { toast } from "react-toastify";
import Marquee from "react-fast-marquee";

interface ActivityBudgetProps {
  section: string;
  categoryId: number;
  budgetId: number;
  deptId: string;
  status: string | undefined;
  sectionOpen:
    | null
    | "PERSONNEL"
    | "Program Activities"
    | "Travel"
    | "PROGRAM OFFICE"
    | "CAPITAL COST"
    | "OVERHEADS";
  setSectionOpen: (
    val:
      | null
      | "PERSONNEL"
      | "Program Activities"
      | "Travel"
      | "PROGRAM OFFICE"
      | "CAPITAL COST"
      | "OVERHEADS",
  ) => void;
  subdepartmentId: number;
  financialYear: string;
}
interface totalschema {
  totalFY: number;
  totalQ1: number;
  totalQ2: number;
  totalQ3: number;
  totalQ4: number;
}
interface subProgramActivitesSchema {
  map: number;
  name: string;
}
interface LevelData {
  budgetDetailsId: number;
  Count: string | number;
  [month: string]: string | number;
}

type TableData = Record<string, LevelData>;

const months = [
  "Apr Qty",
  "Apr Rate",
  "Apr Amt",
  "Apr",
  "May Qty",
  "May Rate",
  "May Amt",
  "May",
  "Jun Qty",
  "Jun Rate",
  "Jun Amt",
  "Jun",
  "Jul Qty",
  "Jul Rate",
  "Jul Amt",
  "Jul",
  "Aug Qty",
  "Aug Rate",
  "Aug Amt",
  "Aug",
  "Sep Qty",
  "Sep Rate",
  "Sep Amt",
  "Sep",
  "Oct Qty",
  "Oct Rate",
  "Oct Amt",
  "Oct",
  "Nov Qty",
  "Nov Rate",
  "Nov Amt",
  "Nov",
  "Dec Qty",
  "Dec Rate",
  "Dec Amt",
  "Dec",
  "Jan Qty",
  "Jan Rate",
  "Jan Amt",
  "Jan",
  "Feb Qty",
  "Feb Rate",
  "Feb Amt",
  "Feb",
  "Mar Qty",
  "Mar Rate",
  "Mar Amt",
  "Mar",
];

// map each month to its quarter key
const monthToQKey: Record<string, string> = {
    Apr: "totalQ1", May: "totalQ1", Jun: "totalQ1",
    Jul: "totalQ2", Aug: "totalQ2", Sep: "totalQ2",
    Oct: "totalQ3", Nov: "totalQ3", Dec: "totalQ3",
    Jan: "totalQ4", Feb: "totalQ4", Mar: "totalQ4",
};

const ActivityBudget: React.FC<ActivityBudgetProps> = ({
  section,
  categoryId,
  budgetId,
  deptId,
  status,
  sectionOpen,
  setSectionOpen,
  subdepartmentId,
  financialYear,
}) => {
  const userData = useSession();
  console.log(userData, "userData");
  const [saveBtnState, setSaveBtnState] = useState<"loading" | "edit" | "save">(
    "loading",
  );
  const [inputStates, setInputStates] = useState<boolean>(true);
  const [totalQty, setTotalQty] = useState<totalschema>({
    totalQ1: 0,
    totalQ2: 0,
    totalQ3: 0,
    totalQ4: 0,
    totalFY: 0,
  });
  const [subProgramActivites, setSubProgramActivites] = useState<
    subProgramActivitesSchema[]
  >([{ map: 0, name: "All" }]);
  const [filter, setFilter] = useState<subProgramActivitesSchema>({
    map: 0,
    name: "All",
  });
  const [tableData, setTableData] = useState<TableData>({});

  // Fetch program activities by department based on user role
  const { data: programActivitiesByDept } =
    api.get.getProgramActivitiesByDepartment.useQuery(
      {
        departmentId: Number(deptId),
        subDepartmentId: subdepartmentId ?? undefined,
        budgetid: budgetId,
      },
      {
        staleTime: 0,
      },
    );
  useEffect(() => {
    if (programActivitiesByDept) {
      setSubProgramActivites([
        { map: 0, name: "All" },
        ...programActivitiesByDept.map((item) => ({
          map: item.value,
          name: item.label,
        })),
      ]);
    }
  }, [programActivitiesByDept]);
  console.log(
    budgetId,
    categoryId,
    deptId,
    subdepartmentId,
    financialYear,
    "budgetId ,categoryId, deptId, subdepartmentId, financialYear",
  );
  // api calls
  const { data: programData, isLoading: programDataLodaing } =
    api.get.getProgramActivities.useQuery(
      {
        budgetId,
        catId: categoryId,
        deptId: Number(deptId),
        activity: filter?.map?.toString(),
        subDeptId: subdepartmentId,
        financialYear,
      },
      {
        staleTime: 0,
      },
    );
  const createBudgetDetails = api.post.addBudgetDetails.useMutation();
  const updateBudgetDetails = api.post.updateBudgetDetails.useMutation();
  // useEffect to update program activities dropdown

  // useEffect hooks
  useEffect(() => {
    if (
      programData?.budgetId == budgetId &&
      programData.subDeptId == subdepartmentId
    ) {
      const initialData: TableData = {};
      if (programData?.subCategories) {
        const totalQtyAfterBudgetDetails: totalschema = {
          totalQ1: 0,
          totalQ2: 0,
          totalQ3: 0,
          totalQ4: 0,
          totalFY: 0,
        };
        setTotalQty(totalQtyAfterBudgetDetails);
        programData.subCategories.forEach((sub) => {
          initialData[sub.subCategoryId] = {
            Count: "",
            "Apr Qty": "0",
            "Apr Rate": "0",
            "Apr Amt": "0",
            Apr: "0",
            "May Qty": "0",
            "May Rate": "0",
            "May Amt": "0",
            May: "0",
            "Jun Qty": "0",
            "Jun Rate": "0",
            "Jun Amt": "0",
            Jun: "0",
            "Jul Qty": "0",
            "Jul Rate": "0",
            "Jul Amt": "0",
            Jul: "0",
            "Aug Qty": "0",
            "Aug Rate": "0",
            "Aug Amt": "0",
            Aug: "0",
            "Sep Qty": "0",
            "Sep Rate": "0",
            "Sep Amt": "0",
            Sep: "0",
            "Oct Qty": "0",
            "Oct Rate": "0",
            "Oct Amt": "0",
            Oct: "0",
            "Nov Qty": "0",
            "Nov Rate": "0",
            "Nov Amt": "0",
            Nov: "0",
            "Dec Qty": "0",
            "Dec Rate": "0",
            "Dec Amt": "0",
            Dec: "0",
            "Jan Qty": "0",
            "Jan Rate": "0",
            "Jan Amt": "0",
            Jan: "0",
            "Feb Qty": "0",
            "Feb Rate": "0",
            "Feb Amt": "0",
            Feb: "0",
            "Mar Qty": "0",
            "Mar Rate": "0",
            "Mar Amt": "0",
            Mar: "0",
            budgetDetailsId: 0,
          };
        });
        setTableData(initialData);
        if (
          programData.result.length > 0 &&
          programData.subCategories.length > 0
        ) {
          setSaveBtnState("edit");
          const totalQtyAfterBudgetDetails: totalschema = {
            totalQ1: 0,
            totalQ2: 0,
            totalQ3: 0,
            totalQ4: 0,
            totalFY: 0,
          };
          programData.result.forEach((item) => {
            // Get the monthly values
            const aprValue = item.april ? Number(item.april) : 0;
            const mayValue = item.may ? Number(item.may) : 0;
            const junValue = item.june ? Number(item.june) : 0;
            const julValue = item.july ? Number(item.july) : 0;
            const augValue = item.august ? Number(item.august) : 0;
            const sepValue = item.september ? Number(item.september) : 0;
            const octValue = item.october ? Number(item.october) : 0;
            const novValue = item.november ? Number(item.november) : 0;
            const decValue = item.december ? Number(item.december) : 0;
            const janValue = item.january ? Number(item.january) : 0;
            const febValue = item.february ? Number(item.february) : 0;
            const marValue = item.march ? Number(item.march) : 0;
            
            // Set each month's total, and also set default qty/rate/amt values
            initialData[item.subcategoryId] = {
              Count: item.total ? Number(item.total) : 0,
              // April
              "Apr Qty": item.aprQty ? Number(item.aprQty) : 0,
              "Apr Rate": item.aprRate ? Number(item.aprRate) : 0,
              "Apr Amt": item.aprAmt ? Number(item.aprAmt) : 0,
              Apr: aprValue.toString(),
              // May
              "May Qty": item.mayQty ? Number(item.mayQty) : 0,
              "May Rate": item.mayRate ? Number(item.mayRate) : 0,
              "May Amt": item.mayAmt ? Number(item.mayAmt) : 0,
              May: mayValue.toString(),
              // June
              "Jun Qty": item.junQty ? Number(item.junQty) : 0,
              "Jun Rate": item.junRate ? Number(item.junRate) : 0,
              "Jun Amt": item.junAmt ? Number(item.junAmt) : 0,
              Jun: junValue.toString(),
              // July
              "Jul Qty": item.julQty ? Number(item.julQty) : 0,
              "Jul Rate": item.julRate ? Number(item.julRate) : 0,
              "Jul Amt": item.julAmt ? Number(item.julAmt) : 0,
              Jul: julValue.toString(),
              // August
              "Aug Qty": item.augQty ? Number(item.augQty) : 0,
              "Aug Rate": item.augRate ? Number(item.augRate) : 0,
              "Aug Amt": item.augAmt ? Number(item.augAmt) : 0,
              Aug: augValue.toString(),
              // September
              "Sep Qty": item.sepQty ? Number(item.sepQty) : 0,
              "Sep Rate": item.sepRate ? Number(item.sepRate) : 0,
              "Sep Amt": item.sepAmt ? Number(item.sepAmt) : 0,
              Sep: sepValue.toString(),
              // October
              "Oct Qty": item.octQty ? Number(item.octQty) : 0,
              "Oct Rate": item.octRate ? Number(item.octRate) : 0,
              "Oct Amt": item.octAmt ? Number(item.octAmt) : 0,
              Oct: octValue.toString(),
              // November
              "Nov Qty": item.novQty ? Number(item.novQty) : 0,
              "Nov Rate": item.novRate ? Number(item.novRate) : 0,
              "Nov Amt": item.novAmt ? Number(item.novAmt) : 0,
              Nov: novValue.toString(),
              // December
              "Dec Qty": item.decQty ? Number(item.decQty) : 0,
              "Dec Rate": item.decRate ? Number(item.decRate) : 0,
              "Dec Amt": item.decAmt ? Number(item.decAmt) : 0,
              Dec: decValue.toString(),
              // January
              "Jan Qty": item.janQty ? Number(item.janQty) : 0,
              "Jan Rate": item.janRate ? Number(item.janRate) : 0,
              "Jan Amt": item.janAmt ? Number(item.janAmt) : 0,
              Jan: janValue.toString(),
              // February
              "Feb Qty": item.febQty ? Number(item.febQty) : 0,
              "Feb Rate": item.febRate ? Number(item.febRate) : 0,
              "Feb Amt": item.febAmt ? Number(item.febAmt) : 0,
              Feb: febValue.toString(),
              // March
              "Mar Qty": item.marQty ? Number(item.marQty) : 0,
              "Mar Rate": item.marRate ? Number(item.marRate) : 0,
              "Mar Amt": item.marAmt ? Number(item.marAmt) : 0,
              Mar: marValue.toString(),
              
              budgetDetailsId: item.id ? Number(Number(item.id)) : 0,
            };
            totalQtyAfterBudgetDetails.totalFY +=
              Number(item.january) +
              Number(item.february) +
              Number(item.march) +
              Number(item.april) +
              Number(item.may) +
              Number(item.june) +
              Number(item.july) +
              Number(item.august) +
              Number(item.september) +
              Number(item.october) +
              Number(item.november) +
              Number(item.december);
            totalQtyAfterBudgetDetails.totalQ1 +=
              Number(item.april) + Number(item.may) + Number(item.june);
            totalQtyAfterBudgetDetails.totalQ2 +=
              Number(item.july) + Number(item.august) + Number(item.september);
            totalQtyAfterBudgetDetails.totalQ3 +=
              Number(item.october) +
              Number(item.november) +
              Number(item.december);
            totalQtyAfterBudgetDetails.totalQ4 +=
              Number(item.january) + Number(item.february) + Number(item.march);
          });
          setTableData(initialData);
          setTotalQty(totalQtyAfterBudgetDetails);
        } else {
          setSaveBtnState("save");
        }
      }
    }
  }, [programData]);
  useEffect(() => {
    handelnputDisable(true);
  }, [filter]);

  // Other fuctions
  const handelnputDisable = (disable: boolean) => {
    const subcategoryIds = [];
    setInputStates(disable);
    for (const [subcategoryId] of Object.entries(tableData)) {
      subcategoryIds.push(subcategoryId);
    }
    subcategoryIds.forEach((id) => {
      const rate1In = document.getElementById(id + "Rate1") as HTMLInputElement;
      const rate2In = document.getElementById(id + "Rate2") as HTMLInputElement;
      const rate3In = document.getElementById(id + "Rate3") as HTMLInputElement;
      const rate4In = document.getElementById(id + "Rate4") as HTMLInputElement;
      const qty1In = document.getElementById(id + "Qty1") as HTMLInputElement;
      const qty2In = document.getElementById(id + "Qty2") as HTMLInputElement;
      const qty3In = document.getElementById(id + "Qty3") as HTMLInputElement;
      const qty4In = document.getElementById(id + "Qty4") as HTMLInputElement;
      const aprQtyIn = document.getElementById(id + "Apr Qty") as HTMLInputElement;
      const aprRateIn = document.getElementById(id + "Apr Rate") as HTMLInputElement;
      const aprAmtIn = document.getElementById(id + "Apr Amt") as HTMLInputElement;
      const aprIn = document.getElementById(id + "Apr") as HTMLInputElement;
      const mayQtyIn = document.getElementById(id + "May Qty") as HTMLInputElement;
      const mayRateIn = document.getElementById(id + "May Rate") as HTMLInputElement;
      const mayAmtIn = document.getElementById(id + "May Amt") as HTMLInputElement;
      const mayIn = document.getElementById(id + "May") as HTMLInputElement;
      const junQtyIn = document.getElementById(id + "Jun Qty") as HTMLInputElement;
      const junRateIn = document.getElementById(id + "Jun Rate") as HTMLInputElement;
      const junAmtIn = document.getElementById(id + "Jun Amt") as HTMLInputElement;
      const junIn = document.getElementById(id + "Jun") as HTMLInputElement;
      const julQtyIn = document.getElementById(id + "Jul Qty") as HTMLInputElement;
      const julRateIn = document.getElementById(id + "Jul Rate") as HTMLInputElement;
      const julAmtIn = document.getElementById(id + "Jul Amt") as HTMLInputElement;
      const julIn = document.getElementById(id + "Jul") as HTMLInputElement;
      const augQtyIn = document.getElementById(id + "Aug Qty") as HTMLInputElement;
      const augRateIn = document.getElementById(id + "Aug Rate") as HTMLInputElement;
      const augAmtIn = document.getElementById(id + "Aug Amt") as HTMLInputElement;
      const augIn = document.getElementById(id + "Aug") as HTMLInputElement;
      const sepQtyIn = document.getElementById(id + "Sep Qty") as HTMLInputElement;
      const sepRateIn = document.getElementById(id + "Sep Rate") as HTMLInputElement;
      const sepAmtIn = document.getElementById(id + "Sep Amt") as HTMLInputElement;
      const sepIn = document.getElementById(id + "Sep") as HTMLInputElement;
      const octQtyIn = document.getElementById(id + "Oct Qty") as HTMLInputElement;
      const octRateIn = document.getElementById(id + "Oct Rate") as HTMLInputElement;
      const octAmtIn = document.getElementById(id + "Oct Amt") as HTMLInputElement;
      const octIn = document.getElementById(id + "Oct") as HTMLInputElement;
      const novQtyIn = document.getElementById(id + "Nov Qty") as HTMLInputElement;
      const novRateIn = document.getElementById(id + "Nov Rate") as HTMLInputElement;
      const novAmtIn = document.getElementById(id + "Nov Amt") as HTMLInputElement;
      const novIn = document.getElementById(id + "Nov") as HTMLInputElement;
      const decQtyIn = document.getElementById(id + "Dec Qty") as HTMLInputElement;
      const decRateIn = document.getElementById(id + "Dec Rate") as HTMLInputElement;
      const decAmtIn = document.getElementById(id + "Dec Amt") as HTMLInputElement;
      const decIn = document.getElementById(id + "Dec") as HTMLInputElement;
      const janQtyIn = document.getElementById(id + "Jan Qty") as HTMLInputElement;
      const janRateIn = document.getElementById(id + "Jan Rate") as HTMLInputElement;
      const janAmtIn = document.getElementById(id + "Jan Amt") as HTMLInputElement;
      const janIn = document.getElementById(id + "Jan") as HTMLInputElement;
      const febQtyIn = document.getElementById(id + "Feb Qty") as HTMLInputElement;
      const febRateIn = document.getElementById(id + "Feb Rate") as HTMLInputElement;
      const febAmtIn = document.getElementById(id + "Feb Amt") as HTMLInputElement;
      const febIn = document.getElementById(id + "Feb") as HTMLInputElement;
      const marQtyIn = document.getElementById(id + "Mar Qty") as HTMLInputElement;
      const marRateIn = document.getElementById(id + "Mar Rate") as HTMLInputElement;
      const marAmtIn = document.getElementById(id + "Mar Amt") as HTMLInputElement; 
      const marIn = document.getElementById(id + "Mar") as HTMLInputElement;
      if (
        aprIn && aprQtyIn && aprRateIn && aprAmtIn &&
        mayIn && mayQtyIn && mayRateIn && mayAmtIn &&
        junIn && junQtyIn && junRateIn && junAmtIn &&
        julIn && julQtyIn && julRateIn && julAmtIn &&
        augIn && augQtyIn && augRateIn && augAmtIn &&
        sepIn && sepQtyIn && sepRateIn && sepAmtIn &&
        octIn && octQtyIn && octRateIn && octAmtIn &&
        novIn && novQtyIn && novRateIn && novAmtIn &&
        decIn && decQtyIn && decRateIn && decAmtIn &&
        janIn && janQtyIn && janRateIn && janAmtIn &&
        febIn && febQtyIn && febRateIn && febAmtIn &&
        marIn && marQtyIn && marRateIn && marAmtIn &&
        rate1In &&
        rate2In &&
        rate3In &&
        rate4In &&
        qty1In &&
        qty2In &&
        qty3In &&
        qty4In
      ) {
        aprIn.disabled = disable;
        aprQtyIn.disabled = disable;
        aprRateIn.disabled = disable;
        aprAmtIn.disabled = disable;
        mayIn.disabled = disable;
        mayQtyIn.disabled = disable;
        mayRateIn.disabled = disable;
        mayAmtIn.disabled = disable;
        junIn.disabled = disable; 
        junQtyIn.disabled = disable;
        junRateIn.disabled = disable;
        junAmtIn.disabled = disable;
        julIn.disabled = disable;
        julQtyIn.disabled = disable;
        julRateIn.disabled = disable;
        julAmtIn.disabled = disable;
        augIn.disabled = disable;
        augQtyIn.disabled = disable;
        augRateIn.disabled = disable;
        augAmtIn.disabled = disable;
        sepIn.disabled = disable;
        sepQtyIn.disabled = disable;
        sepRateIn.disabled = disable;
        sepAmtIn.disabled = disable;
        octIn.disabled = disable; 
        octQtyIn.disabled = disable;
        octRateIn.disabled = disable;
        octAmtIn.disabled = disable;
        novIn.disabled = disable;
        novQtyIn.disabled = disable;
        novRateIn.disabled = disable;
        novAmtIn.disabled = disable;
        decIn.disabled = disable;
        decQtyIn.disabled = disable;
        decRateIn.disabled = disable;
        decAmtIn.disabled = disable;
        janIn.disabled = disable;
        janQtyIn.disabled = disable;
        janRateIn.disabled = disable;
        janAmtIn.disabled = disable;
        febIn.disabled = disable;
        febQtyIn.disabled = disable;
        febRateIn.disabled = disable;
        febAmtIn.disabled = disable;  
        marIn.disabled = disable;
        marQtyIn.disabled = disable;
        marRateIn.disabled = disable;
        marAmtIn.disabled = disable;
        rate1In.disabled = disable;
        rate2In.disabled = disable;
        rate3In.disabled = disable;
        rate4In.disabled = disable;
        qty1In.disabled = disable;
        qty2In.disabled = disable;
        qty3In.disabled = disable;
        qty4In.disabled = disable;
      }
      // else {
      //   console.error(`Input element with ID  not found.`);
      //   console.log(aprIn, rate1In, rate2In, rate3In, qty1In, qty2In)
      // }
    });
  };
  const handleSelect = (val: subProgramActivitesSchema) => {
    setFilter(val);
  };
  const updateTotalQtyVals = (which: string, difference: number) => {
    setTotalQty((prev) => {
      const updatedTotal = { ...prev };
      updatedTotal[which as keyof typeof prev] += difference;
      updatedTotal["totalFY" as keyof typeof prev] += difference;
      return updatedTotal;
    });
  };
  const isSaveDisabled = () => {
    // Only check the actual month fields that matter for saving (Apr, May, Jun, etc.)
    const mainMonths = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    return Object.values(tableData).some((subData) => {
      return mainMonths.some((month) => {
        return !subData[month]?.toString().trim();
      });
    });
  };

  // Function to determine if a field is read-only (month names or Amt fields)
  const isReadOnlyField = (month: string) => {
    // Check if it's a month name only (Apr, May, etc.) or ends with "Amt"
    return !month.includes(" ") || month.endsWith(" Amt");
  };

  const handleInputChange = (
    subCategoryId: number,
    month: string,
    value: string
  ) => {
    // Skip if trying to edit a read-only field directly
    if (isReadOnlyField(month)) {
      return;
    }
    
    setTableData((prev: TableData) => {
      const updated = { ...prev };
      const row = updated[subCategoryId];
      if (!row) return prev;

      // 1) If it's a bare month name, adjust that quarter's total.
      const qKey = monthToQKey[month];
      if (qKey) {
        const oldVal = Number(row[month] ?? 0);
        const newVal = Number(value);
        updateTotalQtyVals(qKey, newVal - oldVal);
      }

      // 2) If it's "XXX Qty" or "XXX Rate", recalc "XXX Amt" and update the base month value
      if (month.includes(" ")) {
        const [m, field] = month.split(" ");        // e.g. ["Apr","Qty"]
        if (field === "Qty" || field === "Rate") {
          const qtyKey = `${m} Qty`;
          const rateKey = `${m} Rate`;
          const amtKey = `${m} Amt`;

          // pick the new qty or rate, and the old companion value
          const qty  = field === "Qty"  ? Number(value) : Number(row[qtyKey]  ?? 0);
          const rate = field === "Rate" ? Number(value) : Number(row[rateKey] ?? 0);

          const calculatedAmount = (qty * rate).toFixed(2);
          row[amtKey] = calculatedAmount;
          
          // Also update the bare month value with the calculated amount
          if (m) {
            row[m] = calculatedAmount;
          }
        }
      }

      // 3) finally store the newly typed‐in value
      row[month] = value;
      updated[subCategoryId] = row;
      return updated;
    });
  };

  const handleSave = async () => {
    setSaveBtnState("loading");
    console.log(tableData, "tableData");
    const budgetDetails = Object.entries(tableData).map(
      ([subCategoryId, data]) => ({
        budgetid: budgetId,
        catid: categoryId,
        subcategoryId: parseInt(subCategoryId, 10),
        // need to be removed
        unit: 1,
        rate: "1",
        total: "1",
        currency: "INR",
        notes: "",
        description: "", 
        // Monthly totals (required fields)
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
        
         // Monthly qty/rate/amt values
         aprQty: Number(data["Apr Qty"] ?? 1),
         aprRate: Number(data["Apr Rate"] ?? 0),
         aprAmt: Number(data["Apr Amt"] ?? 0),
         
         mayQty: Number(data["May Qty"] ?? 1),
         mayRate: Number(data["May Rate"] ?? 0),
         mayAmt: Number(data["May Amt"] ?? 0),
         
         junQty: Number(data["Jun Qty"] ?? 1),
         junRate: Number(data["Jun Rate"] ?? 0),
         junAmt: Number(data["Jun Amt"] ?? 0),
         
         julQty: Number(data["Jul Qty"] ?? 1),
         julRate: Number(data["Jul Rate"] ?? 0),
         julAmt: Number(data["Jul Amt"] ?? 0),
         
         augQty: Number(data["Aug Qty"] ?? 1),
         augRate: Number(data["Aug Rate"] ?? 0),
         augAmt: Number(data["Aug Amt"] ?? 0),
         
         sepQty: Number(data["Sep Qty"] ?? 1),
         sepRate: Number(data["Sep Rate"] ?? 0),
         sepAmt: Number(data["Sep Amt"] ?? 0),
         
         octQty: Number(data["Oct Qty"] ?? 1),
         octRate: Number(data["Oct Rate"] ?? 0),
         octAmt: Number(data["Oct Amt"] ?? 0),
         
         novQty: Number(data["Nov Qty"] ?? 1),
         novRate: Number(data["Nov Rate"] ?? 0),
         novAmt: Number(data["Nov Amt"] ?? 0),
         
         decQty: Number(data["Dec Qty"] ?? 1),
         decRate: Number(data["Dec Rate"] ?? 0),
         decAmt: Number(data["Dec Amt"] ?? 0),
         
         janQty: Number(data["Jan Qty"] ?? 1),
         janRate: Number(data["Jan Rate"] ?? 0),
         janAmt: Number(data["Jan Amt"] ?? 0),
         
         febQty: Number(data["Feb Qty"] ?? 1),
         febRate: Number(data["Feb Rate"] ?? 0),
         febAmt: Number(data["Feb Amt"] ?? 0),
         
         marQty: Number(data["Mar Qty"] ?? 1),
         marRate: Number(data["Mar Rate"] ?? 0),
         marAmt: Number(data["Mar Amt"] ?? 0),
        
        activity: (filter?.map ?? "").toString(),
        deptId: Number(deptId),
        createdBy: userData.data?.user.id ?? 1,
        createdAt: new Date().toISOString(),
      }),
    );

    try {
      console.log(budgetDetails, "savebudgetDetails");
      createBudgetDetails.mutate(
        {
          deptId: Number(deptId),
          budgetId: budgetId,
          catId: categoryId,
          data: budgetDetails,
          subDeptId: subdepartmentId,
        },
        {
          onSuccess: (data) => {
            toast.success("Successfully Saved", {
              position: "bottom-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            handelnputDisable(true);
            setSaveBtnState("edit");
            setTableData((prev) => {
              const updatedData = { ...prev };
              data.data.map((item) => {
                const subCategoryData = updatedData[item.subcategoryId];
                if (subCategoryData) {
                  updatedData[item.subcategoryId] = {
                    ...subCategoryData,
                    budgetDetailsId: item.budgetDetailsId,
                  };
                }
              });
              return updatedData;
            });
            console.log("Budget created successfully:", data);
          },
          onError: (error) => {
            setSaveBtnState("save");
            throw new Error(JSON.stringify(error));
            console.error("Error creating budget:", error);
          },
        },
      );
    } catch (error) {
      console.error("Failed to save budget details:", error);
      toast.warn("Error While saving ", {
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

  const handleUpdate = async () => {
    setSaveBtnState("loading");
    const budgetDetails = Object.entries(tableData).map(
      ([subCategoryId, data]) => ({
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
        // Monthly totals (required fields)
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
        
        // Monthly qty/rate/amt values
        aprQty: Number(data["Apr Qty"] ?? 1),
        aprRate: Number(data["Apr Rate"] ?? 0),
        aprAmt: Number(data["Apr Amt"] ?? 0),
        
        mayQty: Number(data["May Qty"] ?? 1),
        mayRate: Number(data["May Rate"] ?? 0),
        mayAmt: Number(data["May Amt"] ?? 0),
        
        junQty: Number(data["Jun Qty"] ?? 1),
        junRate: Number(data["Jun Rate"] ?? 0),
        junAmt: Number(data["Jun Amt"] ?? 0),
        
        julQty: Number(data["Jul Qty"] ?? 1),
        julRate: Number(data["Jul Rate"] ?? 0),
        julAmt: Number(data["Jul Amt"] ?? 0),
        
        augQty: Number(data["Aug Qty"] ?? 1),
        augRate: Number(data["Aug Rate"] ?? 0),
        augAmt: Number(data["Aug Amt"] ?? 0),
        
        sepQty: Number(data["Sep Qty"] ?? 1),
        sepRate: Number(data["Sep Rate"] ?? 0),
        sepAmt: Number(data["Sep Amt"] ?? 0),
        
        octQty: Number(data["Oct Qty"] ?? 1),
        octRate: Number(data["Oct Rate"] ?? 0),
        octAmt: Number(data["Oct Amt"] ?? 0),
        
        novQty: Number(data["Nov Qty"] ?? 1),
        novRate: Number(data["Nov Rate"] ?? 0),
        novAmt: Number(data["Nov Amt"] ?? 0),
        
        decQty: Number(data["Dec Qty"] ?? 1),
        decRate: Number(data["Dec Rate"] ?? 0),
        decAmt: Number(data["Dec Amt"] ?? 0),
        
        janQty: Number(data["Jan Qty"] ?? 1),
        janRate: Number(data["Jan Rate"] ?? 0),
        janAmt: Number(data["Jan Amt"] ?? 0),
        
        febQty: Number(data["Feb Qty"] ?? 1),
        febRate: Number(data["Feb Rate"] ?? 0),
        febAmt: Number(data["Feb Amt"] ?? 0),
        
        marQty: Number(data["Mar Qty"] ?? 1),
        marRate: Number(data["Mar Rate"] ?? 0),
        marAmt: Number(data["Mar Amt"] ?? 0),
        
        activity: (filter?.map ?? "").toString(),
        updatedBy: userData.data?.user.id ?? 1,
        updatedAt: new Date().toISOString(),
      }),
    );
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
            toast.success("Successfully Saved", {
              position: "bottom-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            handelnputDisable(true);
            console.log("Budget updated successfully:", data);
          },
          onError: (error) => {
            throw new Error(JSON.stringify(error));
            console.error("Error updating budget:", error);
          },
        },
      );
    } catch (error) {
      toast.warn("Error While saving ", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.error("Failed to update budget details:", error);
    } finally {
      setSaveBtnState("edit");
    }
  };
console.log(inputStates, "inputStates")
return (
    <div className="my-6 rounded-md bg-white shadow-lg">
      {/* {JSON.stringify(tableData)} */}
      {/* <ToastContainer/> */}
      <details
        className={`group mx-auto w-full overflow-hidden rounded bg-[#F5F5F5] shadow transition-[max-height] duration-500`}
        open={sectionOpen == "Program Activities"}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <summary
          className="flex cursor-pointer items-center justify-between gap-32 rounded-md border border-primary bg-primary/10 p-2 text-primary outline-none"
          onClick={(e) => {
            e.preventDefault();
            if (sectionOpen == "Program Activities") setSectionOpen(null);
            else setSectionOpen("Program Activities");
          }}
        >
          <h1 className="text-md w-1/6 font-medium capitalize">
            {section.toLowerCase()}
          </h1>
          {programDataLodaing ? (
            <div className="flex items-center space-x-2">
              <p className="text-sm">Loading.....</p>
            </div>
          ) : (
            <div className="flex w-5/6 items-center gap-20">
              <div className="w-1/6 rounded-md border border-primary/20 bg-primary/5 px-3 py-1">
                <span className="text-sm font-medium">Q1:</span>{" "}
                {totalQty.totalQ1.toLocaleString("hi-IN")}
              </div>
              <div className="w-1/6 rounded-md border border-primary/20 bg-primary/5 px-3 py-1">
                <span className="text-sm font-medium">Q2:</span>{" "}
                {totalQty.totalQ2.toLocaleString("hi-IN")}
              </div>
              <div className="w-1/6 rounded-md border border-primary/20 bg-primary/5 px-3 py-1">
                <span className="text-sm font-medium">Q3:</span>{" "}
                {totalQty.totalQ3.toLocaleString("hi-IN")}
              </div>
              <div className="w-1/6 rounded-md border border-primary/20 bg-primary/5 px-3 py-1">
                <span className="text-sm font-medium">Q4:</span>{" "}
                {totalQty.totalQ4.toLocaleString("hi-IN")}
              </div>
              <div className="w-1/6 rounded-md border border-primary/20 bg-primary/5 px-3 py-1">
                <span className="text-sm font-medium">FY:</span>{" "}
                {totalQty.totalFY.toLocaleString("hi-IN")}
              </div>
              {/* <div className='flex items-center justify-end'> */}
              <span className="text-lg font-bold transition-transform group-open:rotate-90">
                →
              </span>
              {/* </div> */}
            </div>
          )}
        </summary>
        <div className="flex items-center gap-2">
          <div className="mt-3 w-72">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex w-full cursor-pointer items-center justify-between rounded-lg border py-1 pl-2 text-left text-sm font-normal text-gray-500">
                  <span className="capitalize">{filter?.name} </span>
                  <RiArrowDropDownLine size={30} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="max-h-56 !w-[250px] overflow-y-scroll rounded-lg bg-white p-2 shadow-lg">
                {subProgramActivites
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((val, ind) => (
                    <DropdownMenu.Item
                      key={ind}
                      className="cursor-pointer rounded p-2 text-sm capitalize hover:bg-gray-100 focus:ring-0"
                      onSelect={() => handleSelect(val)}
                    >
                      {val.name}
                    </DropdownMenu.Item>
                  ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
          <Marquee className="flex w-full flex-col items-end gap-1 pr-10 font-medium">
            {subProgramActivites.map((pa) => {
              if (pa.name == "All") return null;
              const activityData = programData?.activityTotals.find(
                (activity) => Number(activity.activityId) == pa.map,
              );
              return (
                <span key={pa.map} className="text-medium mr-2">
                  <span className="font-semibold text-green-800">
                    {" "}
                    {pa.name}
                  </span>{" "}
                  | FY :{" "}
                  {activityData
                    ? (
                        Number(activityData?.q1) +
                        Number(activityData?.q2) +
                        Number(activityData?.q3) +
                        Number(activityData?.q4)
                      ).toLocaleString("hi-IN")
                    : "NA"}{" "}
                  | Q1 :{" "}
                  {activityData
                    ? Number(activityData?.q1).toLocaleString("hi-IN")
                    : "NA"}{" "}
                  | Q2:{" "}
                  {activityData
                    ? Number(activityData?.q2).toLocaleString("hi-IN")
                    : "NA"}{" "}
                  | Q3 :{" "}
                  {activityData
                    ? Number(activityData?.q3).toLocaleString("hi-IN")
                    : "NA"}{" "}
                  | Q4:{" "}
                  {activityData
                    ? Number(activityData?.q4).toLocaleString("hi-IN")
                    : "NA"}
                </span>
              );
            })}
          </Marquee>
        </div>

        <hr className="my-2 scale-x-150" />

        <div className="overflow-scroll bg-gray-50">
          {/* Table */}
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left text-sm text-gray-600">
                <th className="border p-2 capitalize">
                  {"Particular".toLowerCase()}
                </th>
                {months.map((month) => (
                  <th key={month} className="border p-2 capitalize">
                    {month.toLowerCase()}
                  </th>
                ))}
              </tr>
            </thead>
            {!programDataLodaing && (
              <tbody>
                {programData?.subCategories.map((sub) => (
                  <tr
                    key={sub.subCategoryId}
                    className="text-sm transition hover:bg-gray-100"
                  >
                    <td className="border p-2 font-medium capitalize">
                      {sub.subCategoryName.toLowerCase()}
                    </td>
                    {months.map((month, key) => (
                      <td key={month} className="border p-2" style={{ minWidth: "100px" }}>
                        <input
                          disabled={inputStates || isReadOnlyField(month)}
                          className={`w-full rounded border p-1 ${isReadOnlyField(month) ? "bg-gray-100" : ""}`}
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
                    {/* <td className="border p-2">
                      <BiComment className="text-xl" />
                    </td> */}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        {filter?.map != 0 &&
          subdepartmentId != 0 &&
          deptId != "0" &&
          ((userData.data?.user.role == 1 && status != "Draft") ||
            (userData.data?.user.role != 1 && status == "Draft")) && (
            <div className="flex flex-row-reverse gap-2 py-2 pr-4">
              {!inputStates && (
                <div>
                  {saveBtnState == "loading" && (
                    <Button
                      type="button"
                      className="!w-20 !cursor-not-allowed border border-black !bg-primary px-2 !text-lg !text-white"
                      variant="soft"
                      // Disable the button if input is empty
                    >
                      Loading...
                    </Button>
                  )}
                  {saveBtnState == "edit" && (
                    <Button
                      type="button"
                      className="!disabled:cursor-not-allowed !w-20 cursor-pointer border border-black !bg-primary px-2 !text-lg !text-white"
                      variant="soft"
                      style={{
                        cursor: isSaveDisabled() ? "not-allowed" : "pointer",
                      }}
                      disabled={isSaveDisabled()}
                      onClick={() => handleUpdate()}
                    >
                      Update
                    </Button>
                  )}
                  {saveBtnState == "save" && (
                    <Button
                      type="button"
                      className="!disabled:cursor-not-allowed !w-20 cursor-pointer border border-black !bg-primary px-2 !text-lg !text-white"
                      variant="soft"
                      style={{
                        cursor: isSaveDisabled() ? "not-allowed" : "pointer",
                      }}
                      disabled={isSaveDisabled()}
                      onClick={() => handleSave()}
                    >
                      Save
                    </Button>
                  )}
                </div>
              )}
              {inputStates ? (
                <Button
                  type="button"
                  className="!disabled:cursor-not-allowed !w-20 cursor-pointer border border-black !bg-primary px-2 !text-lg !text-white"
                  variant="soft"
                  style={{ cursor: "pointer" }}
                  onClick={() => handelnputDisable(false)}
                >
                  Edit
                </Button>
              ) : (
                <Button
                  type="button"
                  className="!disabled:cursor-not-allowed !w-20 cursor-pointer border border-primary px-2 !text-lg !text-primary"
                  variant="soft"
                  style={{ cursor: "pointer" }}
                  onClick={() => handelnputDisable(true)}
                >
                  Cancel
                </Button>
              )}
            </div>
          )}
      </details>
    </div>
  );
};

export default ActivityBudget;

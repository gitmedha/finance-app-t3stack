'use client';

import { useEffect, useState } from "react";
import BudgetFilterForm from "./filter";
import PersonnelCost from "./personnelCost";
import ActivityBudget from "./activityBudget";
import TravelBudget from "./travel";
import ProgramOffice from "./programOffice";
import CapitalCost from "./capitalCost";
import OverHeads from "./overheads";
import type { FilterOptions } from "./budget";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";

// Define types for filters

type HandleSelectValue =
  | { id: string | number; departmentname: string } // For department objects
  | string // For simple string values
  | number; // For numeric values


const Budget: React.FC = () => {
  // Explicitly define the type for filters
  const userData = useSession()
  const [status,setStatus] = useState<string|undefined>(undefined)
  const [filters, setFilters] = useState<FilterOptions>({
    department: userData.data?.user.departmentId?.toString() ?? '', 
    departmentname: userData.data?.user.departmentName ?? " ",
    year: '',
  });
  const [budgetId,setBudgetId] = useState<number|null>(null)
  const handleSelect = (name: string, value: HandleSelectValue) => {
    // setBudgetId(null)
    console.log("I am getting hitted")
    if (name === 'department' && typeof value === 'object' && value !== null) {
      const departmentValue = value as { id: string; departmentname: string }; // Narrow type
      setFilters((prev) => ({
        ...prev,
        department: departmentValue.id, // Use the explicit type
        departmentname: departmentValue.departmentname, // Extract department name
      }));
    } else if (name === 'year' && typeof value === 'string') {
      setFilters((prev) => ({
        ...prev,
        [name]: value, // Year is a string
      }));
    }
  };
  const shouldFetch = filters.department !== "" && filters.year !== "";
  const { data: budgetRes, isLoading, error } = api.get.getBudgetMaster.useQuery(
    shouldFetch
      ? {
        deptId: Number(filters.department),
        financialYear: filters.year,
      }
      : {
        deptId:1,
        financialYear:"1"
      }, 
    {
      enabled: shouldFetch,
    }
  );
  useEffect(() => {
    if (budgetRes) {
      setBudgetId(budgetRes.budgetId ?? null); // Set null if no budgetId
      setStatus(budgetRes.status ?? undefined)
    } else {
      setBudgetId(null);
      setStatus(undefined)
    }
  }, [budgetRes]);
  // get all main categories 
  const { data} = api.get.getCats.useQuery();
  return (
    <div className="mt-10 overflow-hidden m-2 p-2">
      <BudgetFilterForm filters={filters} handleSelect={handleSelect} budgetId={budgetId} setBugetId={setBudgetId} status={status} setStatus={setStatus}/>
      {
        isLoading && <div>loading</div>
      }
      {
        budgetId && !isLoading && <div>
          <PersonnelCost section='PERSONNEL' categoryId={data?.categories[0] ? data?.categories[0].categoryId : 1} deptId={filters.department} budgetId={budgetId} status={status} />
          <ActivityBudget section='Program Activities' categoryId={data?.categories[1] ? data?.categories[1].categoryId : 2} budgetId={budgetId} deptId={filters.department} status={status} />
          <TravelBudget section='Travel' categoryId={data?.categories[2] ? data?.categories[2].categoryId : 3} deptId={filters.department} budgetId={budgetId} searchSubCatId={data?.categories[0] ? data?.categories[0].categoryId : 1} status={status} />
          <ProgramOffice section='PROGRAM OFFICE' categoryId={data?.categories[3] ? data?.categories[3].categoryId : 4} budgetId={budgetId} deptId={filters.department} status={status} />
          <CapitalCost section='CAPITAL COST' categoryId={data?.categories[4] ? data?.categories[4].categoryId : 5} budgetId={budgetId} deptId={filters.department} status={status} />
          <OverHeads section='OVERHEADS' categoryId={data?.categories[5] ? data?.categories[5].categoryId : 6} budgetId={budgetId} deptId={filters.department} status={status} />
        </div>
      }      
    </div>
  );
};

export default Budget;

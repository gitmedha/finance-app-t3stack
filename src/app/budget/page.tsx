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

// Define types for filters


// Define the structure of the value passed to handleSelect
type HandleSelectValue =
  | { id: string | number; departmentname: string } // For department objects
  | string // For simple string values
  | number; // For numeric values


const Budget: React.FC = () => {
  // Explicitly define the type for filters
  const [filters, setFilters] = useState<FilterOptions>({
    department: '', 
    departmentname: '',
    year: '',
  });
  const [budgetId,setBudgetId] = useState<number|null>(null)
  const handleSelect = (name: string, value: HandleSelectValue) => {
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
      }, // Pass undefined if no filters are set to skip fetching
    {
      enabled: shouldFetch, // Only fetch if the filters are valid
    }
  );
  useEffect(() => {
    if (budgetRes) {
      setBudgetId(budgetRes.budgetId ?? null); // Set null if no budgetId
    } else {
      setBudgetId(null);
    }
  }, [budgetRes]);
  // get all main categories 
  const { data, refetch } = api.get.getCats.useQuery();
  return (
    <div className="mt-10 overflow-hidden m-2 p-2">
      <BudgetFilterForm filters={filters} handleSelect={handleSelect} budgetId={budgetId} setBugetId={setBudgetId}/>
      {
        budgetId && <div>
          <PersonnelCost section='PERSONNEL' categoryId={data?.categories[0] ? data?.categories[0].categoryId : 1} deptId={filters.department} budgetId={budgetId} />
          <ActivityBudget section='Program Activities' categoryId={data?.categories[1] ? data?.categories[1].categoryId : 2} budgetId={budgetId} deptId={filters.department} />
          <TravelBudget section='Travel' />
          <ProgramOffice section='PROGRAM OFFICE' />
          <CapitalCost section='CAPITAL COST' categoryId={data?.categories[4] ? data?.categories[4].categoryId : 5} budgetId={budgetId} deptId={filters.department}/>
          <OverHeads section='OVERHEADS' categoryId={data?.categories[5] ? data?.categories[5].categoryId : 6} budgetId={budgetId} deptId={filters.department} />
        </div>
      }
      
      
    </div>
  );
};

export default Budget;

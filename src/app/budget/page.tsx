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
  const year = new Date().getFullYear()
  const month = new Date().getMonth()
  const [status,setStatus] = useState<string|undefined>(undefined)
  const [sectionOpen, setSectionOpen] = useState<null | "PERSONNEL" | "Program Activities" | "Travel" | "PROGRAM OFFICE" | "CAPITAL COST" |"OVERHEADS">(null)
  const [filters, setFilters] = useState<FilterOptions>({
    department: userData.data?.user.departmentId?.toString() ?? '0', 
    departmentname: userData.data?.user.departmentName ?? "All",
    year: month >= 3 ? `${year.toString()}-${(year + 1).toString().slice(2)}` : `${(year - 1).toString()}-${year.toString().slice(2)}` ,
    // need to be updated wit respect to user login
    subdepartmentId: userData.data?.user.subDepartmentId ?? 0,
    subdepartmentName: userData.data?.user.subDepartmentName ?? "All"
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
    }
    else if (name === 'subdepartment' && typeof value === 'object' && value !== null){
      const subDeptVal = value as { id: number; departmentname: string }; // Narrow type
      setFilters((prev) => ({
        ...prev,
        subdepartmentId: subDeptVal.id, 
        subdepartmentName: subDeptVal.departmentname,
      }));
    } 
    else if (name === 'year' && typeof value === 'string') {
      setFilters((prev) => ({
        ...prev,
        [name]: value, // Year is a string
      }));
    }
  };
  const shouldFetch = filters.department !== "" && filters.year !== "";
  const { data: budgetRes, isLoading} = api.get.getBudgetMaster.useQuery(
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
      setBudgetId(budgetRes.budgetId ?? null); 
      setStatus(budgetRes.status ?? undefined)
    } else {
      setBudgetId(null);
      setStatus(undefined)
    }
  }, [budgetRes]);
  // get all main categories 
  const { data} = api.get.getCats.useQuery();
  return (
    <div className=" overflow-hidden ">
      <BudgetFilterForm filters={filters} handleSelect={handleSelect} budgetId={budgetId} setBugetId={setBudgetId} status={status} setStatus={setStatus}/>
      {
        isLoading && <div>loading</div>
      }
      
      {
        
        (budgetId!=null) && !isLoading && <div className="m-2 mt-24">
          <div className='text-right p-2 text-green-900 font-black mt-20'>
            {
              status == "submitted" && <p>{status.toUpperCase()}</p>
            }
            {
              status == "draft" && userData.data?.user.role == 1 && <p className='text-red-900'>{status.toUpperCase()}</p>
            }
            {
              status == "approved" && <p>{status.toUpperCase()}</p>
            }
          </div>
          <PersonnelCost section='PERSONNEL' categoryId={data?.categories[0] ? data?.categories[0].categoryId : 1} deptId={filters.department} budgetId={budgetId} status={status} setSectionOpen={setSectionOpen} sectionOpen={sectionOpen} travelCatId={data?.categories[2] ? data?.categories[2].categoryId : 3} subdepartmentId={filters.subdepartmentId} financialYear={filters.year} />
          <ActivityBudget section='Program Activities' categoryId={data?.categories[1] ? data?.categories[1].categoryId : 2} budgetId={budgetId} deptId={filters.department} status={status} setSectionOpen={setSectionOpen} sectionOpen={sectionOpen} subdepartmentId={filters.subdepartmentId} financialYear={filters.year} />
          <TravelBudget section='Travel' categoryId={data?.categories[2] ? data?.categories[2].categoryId : 3} deptId={filters.department} budgetId={budgetId} searchSubCatId={data?.categories[0] ? data?.categories[0].categoryId : 1} status={status} setSectionOpen={setSectionOpen} sectionOpen={sectionOpen} subdepartmentId={filters.subdepartmentId} financialYear={filters.year} />
          <ProgramOffice section='PROGRAM OFFICE' categoryId={data?.categories[3] ? data?.categories[3].categoryId : 4} budgetId={budgetId} deptId={filters.department} status={status} sectionOpen={sectionOpen} setSectionOpen={setSectionOpen} subdepartmentId={filters.subdepartmentId} financialYear={filters.year} />
          <CapitalCost section='CAPITAL COST' categoryId={data?.categories[4] ? data?.categories[4].categoryId : 5} budgetId={budgetId} deptId={filters.department} status={status} sectionOpen={sectionOpen} setSectionOpen={setSectionOpen} subdepartmentId={filters.subdepartmentId} financialYear={filters.year}/>
          <OverHeads section='OVERHEADS' categoryId={data?.categories[5] ? data?.categories[5].categoryId : 6} budgetId={budgetId} deptId={filters.department} status={status} sectionOpen={sectionOpen} setSectionOpen={setSectionOpen} subdepartmentId={filters.subdepartmentId} financialYear={filters.year} />
        </div>
      }      
    </div>
  );
};

export default Budget;

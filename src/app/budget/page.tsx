'use client';

import { useState } from "react";
import BudgetFilterForm from "./filter";
import PersonnelCost from "./personnelCost";
import ActivityBudget from "./activityBudget";
import TravelBudget from "./travel";
import ProgramOffice from "./programOffice";
import CapitalCost from "./capitalCost";
import OverHeads from "./overheads";
import type { FilterOptions } from "./budget";

// Define types for filters


// Define the structure of the value passed to handleSelect
type HandleSelectValue =
  | { id: string | number; departmentname: string } // For department objects
  | string // For simple string values
  | number; // For numeric values


const Budget: React.FC = () => {
  // Explicitly define the type for filters
  const [filters, setFilters] = useState<FilterOptions>({
    department: '', // Default to an empty string
    departmentname: '',
    year: '',
  });

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

  return (
    <div className="mt-10 overflow-hidden m-2 p-2">
      <BudgetFilterForm filters={filters} handleSelect={handleSelect} />
      <PersonnelCost section='PERSONNEL' />
      <ActivityBudget section='Program Activities' />
      <TravelBudget section='Travel' />
      <ProgramOffice section='PROGRAM OFFICE' />
      <CapitalCost section='CAPITAL COST' />
      <OverHeads section='OVERHEADS' />
    </div>
  );
};

export default Budget;

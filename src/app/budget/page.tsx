'use client';

import { useState } from "react";
import BHead from "./bHead";
import BudgetFilterForm from "./filter";

// Define types for filters
interface Filters {
  department: string; // Department ID as string
  departmentname: string; // Department name as string
  year: string; // Year as string
}

// Define the structure of the value passed to handleSelect
type HandleSelectValue = { id: string; departmentname: string } | string | number;

const sections = [
  'PERSONNEL',
  'PROGRAM ACTIVITIES',
  'TRAVEL ',
  'PROGRAM OFFICE',
  'CAPITAL COST',
  'OVERHEADS',
];

const Budget: React.FC = () => {
  // Explicitly define the type for filters
  const [filters, setFilters] = useState<Filters>({
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
      {sections.map((section) => (
        <BHead key={section} section={section} />
      ))}
    </div>
  );
};

export default Budget;

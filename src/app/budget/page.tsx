// 'use client';

// import { useState } from "react";
// import BHead from "./bHead";
// import BudgetFilterForm from "./filter";

// const sections = [
//   'PERSONNEL',
//   'PROGRAM ACTIVITIES',
//   'TRAVEL ',
//   'PROGRAM OFFICE',
//   'CAPITAL COST',
//   'OVERHEADS',
// ];

// const Budget: React.FC = () => {
//   const [filters, setFilters] = useState({
//     department: '',  // Set to an empty string initially
//     departmentname: '',
//     year: '',
//   });

//   const handleSelect = (name: string, value: string | object) => {
//     if (name === 'department') {
//       // Ensure department is a string (department ID should be a string)
//       setFilters((prev) => ({
//         ...prev,
//         [name]: value ? String((value as any)?.id) : '', // Convert to string and handle reset case
//         departmentname: (value as any)?.departmentname ?? '', // Set department name
//       }));
//     } else if (name === 'year') {
//       setFilters((prev) => ({
//         ...prev,
//         [name]: value as string, // Ensure year is set as a string
//       }));
//     }
//   };

//   return (
//     <div className="mt-10 overflow-hidden m-2 p-2">
//       <BudgetFilterForm filters={filters} handleSelect={handleSelect} />
//       {sections.map((section) => (
//         <BHead key={section} section={section} />
//       ))}
//     </div>
//   );
// };

// export default Budget;



'use client';

import { useState } from "react";
import BHead from "./bHead";
import BudgetFilterForm from "./filter";

const sections = [
  'PERSONNEL',
  'PROGRAM ACTIVITIES',
  'TRAVEL ',
  'PROGRAM OFFICE',
  'CAPITAL COST',
  'OVERHEADS',
];

const Budget: React.FC = () => {
  const [filters, setFilters] = useState({
    department: '', // Can be an empty string or number
    departmentname: '',
    year: '',
  });

  const handleSelect = (name: string, value: string | number | object) => {
    if (name === 'department') {
      // Ensure department is a string (department ID should be a string)
      setFilters((prev) => ({
        ...prev,
        [name]: value ? String((value as any)?.id) : '', // Convert to string and handle reset case
        departmentname: (value as any)?.departmentname ?? '', // Set department name
      }));
    } else if (name === 'year') {
      setFilters((prev) => ({
        ...prev,
        [name]: value as string, // Ensure year is set as a string
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

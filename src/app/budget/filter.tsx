import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { RiArrowDropDownLine } from "react-icons/ri";
import { api } from '~/trpc/react';
import { useEffect } from 'react';

interface FilterOptions {
  department: string | number;  // Allow department to be string or number
  departmentname: string;
  year: string | number;
}

interface BudgetFilterFormProps {
  filters: FilterOptions;
  handleSelect: (name: string, value: string | number | object) => void;
}

const BudgetFilterForm: React.FC<BudgetFilterFormProps> = ({ filters, handleSelect }) => {

  // Fetch data for departments
  const { data, refetch } = api.get.getDepartments.useQuery(
    { page: 1, limit: 100 },
    { enabled: true }
  );

  useEffect(() => {
    if (data && data.departments.length === 0) {
      void refetch(); // Trigger refetch if departments are empty
    }
  }, [data, refetch]);

  // Define years from 2023-24 to 2029-30
  const years = [
    "2023-24", "2024-25", "2025-26", "2026-27", 
    "2027-28", "2028-29", "2029-30"
  ];

  return (
    <div className="flex justify-start items-center space-x-2">
      <div className="w-52">
        {/* Department Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center">
              <span>
                {filters.departmentname || 'Select Department'}
              </span>
              <RiArrowDropDownLine size={30} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
            <DropdownMenu.Item
              className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
              onSelect={() => handleSelect('department', '')} // Reset department
            >
              All
            </DropdownMenu.Item>
            {data?.departments.map((dep) => (
              <DropdownMenu.Item
                key={dep.id}
                className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                onSelect={() => handleSelect('department', dep)} // Pass the whole department object
              >
                {dep.departmentname}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      <div className="w-52">
        {/* Year Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center">
              <span>
                {filters.year || 'Select Year'}
              </span>
              <RiArrowDropDownLine size={30} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
            {years.map((year) => (
              <DropdownMenu.Item
                key={year}
                className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                onSelect={() => handleSelect('year', year)} // Set selected year
              >
                {year}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>
  );
};

export default BudgetFilterForm;

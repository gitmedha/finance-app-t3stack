import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { RiArrowDropDownLine } from "react-icons/ri";
import { api } from '~/trpc/react';
import { useEffect } from 'react';
import type { BudgetFilterFormProps } from "./budget";
import { Button } from '@radix-ui/themes';

const BudgetFilterForm: React.FC<BudgetFilterFormProps> = ({ filters, handleSelect }) => {

  // Fetch data for departments
  const { data, refetch } = api.get.getDepartments.useQuery(
    { page: 1, limit: 100, type: 'Department' },
    { enabled: true }
  );
  // Define years from 2023-24 to 2029-30
  const years = [
    "2023-24", "2024-25", "2025-26", "2026-27",
    "2027-28", "2028-29", "2029-30"
  ];
  useEffect(() => {
    if (data && data.departments.length === 0) {
      void refetch(); // Trigger refetch if departments are empty
    }
  }, [data, refetch]);
  useEffect(() => {
    if (data?.departments?.length) {
      const sortedDepartments = [...data.departments].sort((a, b) =>
        a.departmentname.localeCompare(b.departmentname)
      );
      if (sortedDepartments[0] && years[0]) {
        handleSelect("department", { id: sortedDepartments[0].id, departmentname: sortedDepartments[0].departmentname })
        handleSelect("year", years[0])
      }

    }
  }, [data]);


  return (
    <div className='flex justify-between'>
      <div className="flex justify-start items-center space-x-2">
        <div className="w-52">
          {/* Department Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center">
                <span>{filters.departmentname}</span>
                <RiArrowDropDownLine size={30} />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
              {data?.departments
                ?.sort((a, b) => a.departmentname.localeCompare(b.departmentname)) // Sorting alphabetically by department name
                .map((dep) => (
                  <DropdownMenu.Item
                    key={dep.id}
                    className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                    onSelect={() => handleSelect("department", { id: dep.id, departmentname: dep.departmentname })} // Pass entire department object
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
      <div className='flex justify-end items-center space-x-2'>
        <Button
          type="button"
          className="!cursor-pointer !text-white !bg-primary px-2"
          variant="soft"
        >
          Save
        </Button>
        <Button
          type="button"
          className="!cursor-pointer !text-white !bg-primary px-2"
          variant="soft"
        >
          Submit
        </Button>
        <Button
          type="button"
          className="!cursor-pointer !text-white !bg-primary px-2"
          variant="soft"
        >
          Approve
        </Button>
      </div>
    </div>
  );
};

export default BudgetFilterForm;

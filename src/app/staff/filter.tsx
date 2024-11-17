
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { RiArrowDropDownLine } from "react-icons/ri";
import type { StaffFilterFormProps } from "./staff";
import { api } from '~/trpc/react';
import { useEffect } from 'react';

// Department, designation ,  status ( Active or Inactive ),  
const StaffFilterForm: React.FC<StaffFilterFormProps> = ({ filters, handleSelect }) => {

  // Fetch data with pagination
  const { data: designations, refetch: designationsFetch } = api.get.getDesignation.useQuery();
  const { data, refetch } = api.get.getDepartments.useQuery(
    { page: 1, limit: 100 },
    { enabled: false } // Disable automatic query execution
  );

  // Trigger refetch on page or limit change
  useEffect(() => {
    void designationsFetch();
    void refetch();
  }, [refetch, designationsFetch]);

  return (
    <>
      <div className='w-52'>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button color="gray" className='cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
              <span>
                {filters.departmentname || 'Select Department'}
              </span>

              <RiArrowDropDownLine size={30} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
            <DropdownMenu.Item
              className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
              onSelect={() => handleSelect('department', { departmentname: '' })}
            >
              All
            </DropdownMenu.Item>
            {data?.departments.map((dep) => (
              <DropdownMenu.Item
                key={dep?.id}
                className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                onSelect={() => handleSelect('department', dep)}
              >
                {dep.departmentname}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      <div className='w-52'>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button color="gray" className='cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
              <span>
                {filters.designation || 'Select Designation'}
              </span>

              <RiArrowDropDownLine size={30} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
            <DropdownMenu.Item
              className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
              onSelect={() => handleSelect('designation', { designation: '' })}
            >
              All
            </DropdownMenu.Item>
            {designations?.designations.map((d, i) => (
              <DropdownMenu.Item
                key={i || d?.designation}
                className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                onSelect={() => handleSelect('designation', d)}
              >
                {d.designation}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      <div className='w-52'>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="w-full" asChild>
            <button color='gray' className='cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
              <span>
                {filters.status || 'Select Status'}
              </span>

              <RiArrowDropDownLine size={30} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
            {[{ value: '' },{ value: 'Active' }, { value: 'Inactive' }].map((status) => (
              <DropdownMenu.Item
                key={status.value}
                className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                onSelect={() => handleSelect('status', status)}
              >
                {status.value || 'All'}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      {/* <div className='w-52'>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="w-full" asChild>
            <button color='gray' className='cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
              <span>
                {filters.status || 'Select Status'}
              </span>

              <RiArrowDropDownLine size={30} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
            {['Active', 'Inactive'].map((status) => (
              <DropdownMenu.Item
                key={status}
                className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                onSelect={() => handleSelect('status', status)}
              >
                {status}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div> */}
    </>
  );
};

export default StaffFilterForm;

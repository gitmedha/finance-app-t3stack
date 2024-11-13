import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { RiArrowDropDownLine } from "react-icons/ri";
import type { DepartmentFilterFormProps } from "./department";
import { api } from '~/trpc/react';
import { useEffect } from 'react';

// Type and status 
const DepartmentFilterForm: React.FC<DepartmentFilterFormProps> = ({ filters, handleSelect }) => {
  const { data, refetch } = api.get.getDepartmentsTypes.useQuery();

  // Trigger refetch on page or limit change
  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <div className='w-52'>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button color="gray" className='cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
              <span>
                {filters.status || 'Select Type'}
              </span>
              <RiArrowDropDownLine size={30} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
            {[{ value: 'Active' }, { value: 'Inactive' }].map((status) => (
              <DropdownMenu.Item
                key={status.value}
                className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                onSelect={() => handleSelect('status', status)}
              >
                {status.value}
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
                {filters.type || 'Select Type'}
              </span>

              <RiArrowDropDownLine size={30} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
            {data?.departmentsType.map((type) => (
              <DropdownMenu.Item
                key={type?.type}
                className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                onSelect={() => handleSelect('status', type)}
              >
                {type?.type}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

    </>
  );
};

export default DepartmentFilterForm;

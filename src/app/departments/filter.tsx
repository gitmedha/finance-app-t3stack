import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { RiArrowDropDownLine } from "react-icons/ri";
import AddDepartment from '../donors/add';
import type { DepartmentFilterFormProps } from "./department";

const categories = ["Finance", "Health", "Education", "Technology", "Miscellaneous"];

const DepartmentFilterForm: React.FC<DepartmentFilterFormProps> = ({ filters, handleSelect }) => {

  return (
    <div className="grid grid-cols-6 gap-4">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button color="gray" className='cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
            <span>
              {filters.deptCode || 'Filter by Select Code'}
            </span>
            <RiArrowDropDownLine size={30} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
          {categories.map((category) => (
            <DropdownMenu.Item
              key={category}
              className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
              onSelect={() => handleSelect('category', category)}
            >
              {category}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="w-full" asChild>
          <button color='gray' className='cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
            <span>
              {filters.type || 'Filter by Select Type'}
            </span>

            <RiArrowDropDownLine size={30} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
          {categories.map((status) => (
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

      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="w-full" asChild>
          <button color='gray' className='cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
            <span>
              {filters.type || 'Filter by Select Type'}
            </span>

            <RiArrowDropDownLine size={30} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
          {categories.map((status) => (
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

      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="w-full" asChild>
          <button color='gray' className='cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
            <span>
              {filters.type || 'Filter by Select Type'}
            </span>

            <RiArrowDropDownLine size={30} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
          {categories.map((status) => (
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
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="w-full" asChild>
          <button color='gray' className='cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
            <span>
              {filters.type || 'Filter by Select Type'}
            </span>

            <RiArrowDropDownLine size={30} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
          {categories.map((status) => (
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
     
      <div className='flex justify-end items-center'>
        <AddDepartment />
      </div>
     
    </div>
  );
};

export default DepartmentFilterForm;

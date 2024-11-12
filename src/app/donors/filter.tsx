import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { RiArrowDropDownLine } from "react-icons/ri";
import AddBudget from './add';
import type { ReportFilterFormProps } from "./donor";

const categories = ["Finance", "Health", "Education", "Technology", "Miscellaneous"];

// Type and status 
const DonorFilterForm: React.FC<ReportFilterFormProps> = ({ filters, handleSelect }) => {

  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
      <div className='grid grid-cols-1 gap-3 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1'>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button color="gray" className='cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
              <span>
                {filters.costCenter || 'Select CostCenter'}
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
                {filters.name || 'Select Name'}
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
          <DropdownMenu.Trigger asChild>
            <button color='gray' className='cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
              <span>
                {filters.finYear || 'Select Year'}
              </span>

              <RiArrowDropDownLine size={30} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
            {categories.map((byTime) => (
              <DropdownMenu.Item
                key={byTime}
                className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                onSelect={() => handleSelect('byTime', byTime)}
              >
                {byTime}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      <div className='flex justify-end items-center'>
        <AddBudget />
      </div>

    </div>
  );
};

export default DonorFilterForm;

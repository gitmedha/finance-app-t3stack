// components/DropdownFilterForm.tsx
import { useState } from "react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { RiArrowDropDownLine } from "react-icons/ri";

const categories = ["Finance", "Health", "Education", "Technology", "Miscellaneous"];

const StaffFilterForm = ({ onApply, onClear }: { onApply: (filters: any) => void; onClear: () => void }) => {
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    byTime: '',
    year: '',
    month: ''
  });

  const handleSelect = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApply = () => {
    onApply(filters);
  };

  const handleClear = () => {
    setFilters({
      category: '',
      status: '',
      byTime: '',
      year: '',
      month: ''
    });
    onClear();
  };

  return (
    <div className="grid grid-cols-6 gap-4">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button color="gray" className='cursor-pointer w-full py-1 border rounded-md text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
            <span>
              {filters.category || 'Filter by Select Category'}
            </span>

            <RiArrowDropDownLine size={30} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 w-full">
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
          <button color='gray' className='cursor-pointer w-full py-1 border rounded-md text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
            <span>
              {filters.status || 'Filter by Select Status'}
            </span>

            <RiArrowDropDownLine size={30} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 w-full">
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
          <button color='gray' className='cursor-pointer w-full py-1 border rounded-md text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
            <span>
              {filters.byTime || 'Filter by Select By time'}
            </span>

            <RiArrowDropDownLine size={30} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 w-full">
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

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button color='gray' className='cursor-pointer w-full py-1 border rounded-md text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
            <span>
              {filters.year || 'Filter by Select Year'}
            </span>

            <RiArrowDropDownLine size={30} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 w-full">
          {categories.map((year) => (
            <DropdownMenu.Item
              key={year}
              className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
              onSelect={() => handleSelect('year', year)}
            >
              {year}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>


      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button color='gray' className='cursor-pointer w-full py-1 border rounded-md text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
            <span>
              {filters.month || 'Filter by Select Month'}
            </span>

            <RiArrowDropDownLine size={30} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 w-full">
          {categories.map((month) => (
            <DropdownMenu.Item
              key={month}
              className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
              onSelect={() => handleSelect('month', month)}
            >
              {month}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <div className="grid grid-cols-2 gap-2 ">
        <button color="gray" className='cursor-pointer w-full py-1 rounded-md border border-primary text-primary' onClick={handleClear}>
          Clear
        </button>
        <button color='green' className='bg-primary cursor-pointer w-full py-1 rounded-md text-white' onClick={handleApply}>
          Apply
        </button>
      </div>
    </div>
  );
};

export default StaffFilterForm;

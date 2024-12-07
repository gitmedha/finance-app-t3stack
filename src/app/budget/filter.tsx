import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { RiArrowDropDownLine } from "react-icons/ri";
import AddBudget from './add';

const categories = ["Finance", "Health", "Education", "Technology", "Miscellaneous"];
interface FilterOptions {
  category: string,
  status: string,
  byTime: string,
  year: string,
  month: string
}
interface BudgetFilterFormProps {
  filters: FilterOptions;
  handleSelect: (name: string, value: string) => void;
}

const BudgetFilterForm: React.FC<BudgetFilterFormProps> = ({ filters, handleSelect }) => {

  return (
    <div className="grid grid-cols-6 gap-4">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button color="gray" className='cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
            <span>
              {filters.category || 'Select Category'}
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
              {filters.status || 'Select Status'}
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
              {filters.byTime || 'Select By time'}
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

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button color='gray' className='cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
            <span>
              {filters.year || 'Select Year'}
            </span>

            <RiArrowDropDownLine size={30} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
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
          <button color='gray' className='cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
            <span>
              {filters.month || 'Select Month'}
            </span>

            <RiArrowDropDownLine size={30} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
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
      <div className='flex justify-end items-center'>
        <AddBudget />
      </div>

    </div>
  );
};

export default BudgetFilterForm;

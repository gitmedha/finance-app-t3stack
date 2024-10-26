import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { RiArrowDropDownLine } from "react-icons/ri";

const financialYear = ['22-23', '23-24', '24-25', '25-26', '26-27', '27-28', '28-29', '29-30'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const template = ['Donar', 'Staff', 'Department']

// Define type for filters
interface Filters {
    temp: string;
    year: string;
    month: string;
}

// Define type for props of ExpenseFilterForm
interface ExpenseFilterFormProps {
    handleSelect: (name: string, value: string) => void;
    filters: Filters;
}

const ExpenseFilterForm = ({ handleSelect, filters }: ExpenseFilterFormProps) => {

    return (
        <div className="grid grid-cols-5 gap-4">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button color="gray" className='cursor-pointer w-full py-1 border rounded-md text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
                        <span>
                            {filters.year || 'Filter by Select Year'}
                        </span>

                        <RiArrowDropDownLine size={30} />
                    </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 w-full">
                    {financialYear?.map((year) => (
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
                <DropdownMenu.Trigger className="w-full" asChild>
                    <button color='gray' className='cursor-pointer w-full py-1 border rounded-md text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
                        <span>
                            {filters.month || 'Filter by Select Month'}
                        </span>

                        <RiArrowDropDownLine size={30} />
                    </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 w-full">
                    {months.map((month) => (
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

            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button color='gray' className='cursor-pointer w-full py-1 border rounded-md text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
                        <span>
                            {filters.temp || 'Filter by Select By Template'}
                        </span>
                        <RiArrowDropDownLine size={30} />
                    </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 w-full">
                    {template.map((temp) => (
                        <DropdownMenu.Item
                            key={temp}
                            className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                            onSelect={() => handleSelect('temp', temp)}
                        >
                            {temp}
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu.Root>

            <div>
                <input className="w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none " id="small_size" type="file" />
            </div>

        </div>
    );
};

export default ExpenseFilterForm;

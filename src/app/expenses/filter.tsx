import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { RiArrowDropDownLine } from "react-icons/ri";
import FileUploadInput from '../_components/Inputs/fileUploadInput';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const template = ['Donor', 'Staff', 'Department']

interface Filters {
    temp: string;
    year: string;
    month: string;
}

interface ExpenseFilterFormProps {
    handleSelect: (name: string, value: string) => void;
    handleFileupload: (data: object) => void;
    filters: Filters;
}

const ExpenseFilterForm = ({ handleSelect, filters, handleFileupload }: ExpenseFilterFormProps) => {

    return (
        <>
            <div className='w-52'>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button color="gray" className="cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center">
                            <span>{filters.month || 'Select Month'}</span>
                            <RiArrowDropDownLine size={30} />
                        </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
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
            </div>

            <div className='w-52'>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button color="gray" className="cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center">
                            <span>{filters.temp || 'Select Template'}</span>
                            <RiArrowDropDownLine size={30} />
                        </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
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
            </div>

            <div className='w-52'>
                <FileUploadInput handleChange={handleFileupload} />
            </div>

        </>
    );
};

export default ExpenseFilterForm;

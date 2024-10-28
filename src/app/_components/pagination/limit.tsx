'use client'; // Ensure this is a client component if you're using React state

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { RiArrowDropDownLine } from 'react-icons/ri';

interface PaginationLimitSelectProps {
  limits: number[]; // Array of pagination limits, e.g., [10, 20, 50, 100]
  selectedLimit: number; // Currently selected limit
  onLimitChange: (limit: number) => void; // Function to call on limit change
}

const PaginationLimitSelect: React.FC<PaginationLimitSelectProps> = ({
  limits,
  selectedLimit,
  onLimitChange,
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="cursor-pointer py-0.5 border rounded-md text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center">
          <span>
            {selectedLimit ? `${selectedLimit} Rows` : 'Select Rows'}
          </span>
          <RiArrowDropDownLine size={30} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
        {limits.map((limit) => (
          <DropdownMenu.Item
            key={limit}
            className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
            onSelect={() => onLimitChange(limit)} // Call the function when a limit is selected
          >
            {limit} Rows
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default PaginationLimitSelect;

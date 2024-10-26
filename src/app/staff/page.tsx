'use client';

import { useState } from "react";
import SearchInput from "~/app/_components/searchInput";
import PaginationLimitSelect from "~/app/_components/pagination/limit";
import ReactPaginationStyle from "~/app/_components/pagination/pagination";
import StaffFilterForm from "./filter";

const staffData = [
  {
    id: 1,
    name: "John Doe",
    position: "Software Engineer",
    department: "IT",
    joiningDate: "2022/08/10",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    position: "HR Manager",
    department: "HR",
    joiningDate: "2021/06/15",
    status: "Active",
  },
  {
    id: 3,
    name: "Tom Johnson",
    position: "Marketing Lead",
    department: "Marketing",
    joiningDate: "2020/02/20",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Lisa Wong",
    position: "Accountant",
    department: "Finance",
    joiningDate: "2019/11/25",
    status: "Active",
  },
  {
    id: 5,
    name: "Michael Brown",
    position: "Project Manager",
    department: "Operations",
    joiningDate: "2021/03/12",
    status: "Active",
  },
  {
    id: 6,
    name: "John Doe",
    position: "Software Engineer",
    department: "IT",
    joiningDate: "2022/08/10",
    status: "Active",
  },
  {
    id: 7,
    name: "Jane Smith",
    position: "HR Manager",
    department: "HR",
    joiningDate: "2021/06/15",
    status: "Active",
  },
  {
    id: 8,
    name: "Tom Johnson",
    position: "Marketing Lead",
    department: "Marketing",
    joiningDate: "2020/02/20",
    status: "Inactive",
  },
  {
    id: 9,
    name: "Lisa Wong",
    position: "Accountant",
    department: "Finance",
    joiningDate: "2019/11/25",
    status: "Active",
  },
  {
    id: 10,
    name: "Michael Brown",
    position: "Project Manager",
    department: "Operations",
    joiningDate: "2021/03/12",
    status: "Active",
  }
];

const totalItems = 100; // Total number of items (for example)
const itemsPerPage = 10; // Items per page

export default function Staff() {
  const [appliedFilters, setAppliedFilters] = useState({});
  const [limit, setLimit] = useState<number>(10); // Default limit
  const [currentPage, setCurrentPage] = useState(0);

  const handlePagination = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected); // Update current page
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    console.log('Selected limit:', newLimit); // Handle limit change as needed
  };

  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
  };

  const handleClearFilters = () => {
    setAppliedFilters({});
    console.log("Filters cleared");
  };

  return (
    <div className="h-full">
      <div className="mb-6 p-2 shadow-md bg-white flex justify-center">
        <div className="container py-1">
          <StaffFilterForm onApply={handleApplyFilters} onClear={handleClearFilters} />
        </div>
      </div>
      <div className="flex justify-center">
        <div className='shadow-md container rounded-md m-2 p-2'>

          <div className="grid grid-cols-2 mb-1">
            <div className="flex justify-start items-center space-x-2">
              <span className="font-semibold">Staff ({staffData.length})</span>
              <div className=" w-80 ">
                <SearchInput placeholder="Search Staff"
                  className="p-2"
                />
              </div>
            </div>

            <div className="flex justify-end items-center space-x-2">
              <ReactPaginationStyle
                total={totalItems}
                currentPage={currentPage}
                handlePagination={handlePagination}
                limit={itemsPerPage}
              />

              <PaginationLimitSelect
                limits={[10, 20, 50, 100]} // Define the limits you want to provide
                selectedLimit={limit}
                onLimitChange={handleLimitChange}
              />
            </div>
          </div>

          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600 text-left text-sm uppercase">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Position</th>
                <th className="px-4 py-2">Department</th>
                <th className="px-4 py-2">Joining Date</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {staffData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-100 transition-colors"
                >
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.position}</td>
                  <td className="px-4 py-2">{item.department}</td>
                  <td className="px-4 py-2">{item.joiningDate}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-lg text-sm ${item.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

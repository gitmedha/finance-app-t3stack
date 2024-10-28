'use client';

import { useState } from "react";
import SearchInput from "~/app/_components/searchInput";
import PaginationLimitSelect from "~/app/_components/pagination/limit";
import ReactPaginationStyle from "~/app/_components/pagination/pagination";
import StaffFilterForm from "./filter";
import EditStaff from "./edit";
import DeleteStaff from "./delete";

const cols = ['Name', 'Emp ID', 'Designation', 'Department', 'Joining Date', 'Status', 'Created At', 'actions']
// add, edit and delete  actions with full modal 

const staffData = [
  {
    Name: 'Alice Johnson',
    EmpID: 'EMP001',
    Designation: 'Software Engineer',
    Department: 'IT',
    JoiningDate: '2020-01-15',
    Status: 'Active',
    CreatedAt: '2020-01-15 10:00:00',
  },
  {
    Name: 'Bob Smith',
    EmpID: 'EMP002',
    Designation: 'Project Manager',
    Department: 'Operations',
    JoiningDate: '2019-04-25',
    Status: 'Active',
    CreatedAt: '2019-04-25 09:30:00',
  },
  {
    Name: 'Charlie Lee',
    EmpID: 'EMP003',
    Designation: 'UI/UX Designer',
    Department: 'Design',
    JoiningDate: '2021-06-20',
    Status: 'Active',
    CreatedAt: '2021-06-20 14:45:00',
  },
  {
    Name: 'Diana Cruz',
    EmpID: 'EMP004',
    Designation: 'HR Specialist',
    Department: 'Human Resources',
    JoiningDate: '2018-11-05',
    Status: 'Inactive',
    CreatedAt: '2018-11-05 08:00:00',
  },
  {
    Name: 'Ethan Brown',
    EmpID: 'EMP005',
    Designation: 'Marketing Executive',
    Department: 'Marketing',
    JoiningDate: '2022-03-15',
    Status: 'Active',
    CreatedAt: '2022-03-15 10:10:00',
  },
  {
    Name: 'Fiona Green',
    EmpID: 'EMP006',
    Designation: 'Accountant',
    Department: 'Finance',
    JoiningDate: '2020-09-12',
    Status: 'Inactive',
    CreatedAt: '2020-09-12 13:30:00',
  },
  {
    Name: 'George King',
    EmpID: 'EMP007',
    Designation: 'Business Analyst',
    Department: 'Operations',
    JoiningDate: '2021-01-30',
    Status: 'Active',
    CreatedAt: '2021-01-30 11:15:00',
  },
  {
    Name: 'Hannah Scott',
    EmpID: 'EMP008',
    Designation: 'Data Scientist',
    Department: 'Data',
    JoiningDate: '2022-07-18',
    Status: 'Active',
    CreatedAt: '2022-07-18 16:20:00',
  },
  {
    Name: 'Ian Walker',
    EmpID: 'EMP009',
    Designation: 'Sales Manager',
    Department: 'Sales',
    JoiningDate: '2019-08-01',
    Status: 'Inactive',
    CreatedAt: '2019-08-01 09:45:00',
  },
  {
    Name: 'Jessica Evans',
    EmpID: 'EMP010',
    Designation: 'Content Writer',
    Department: 'Marketing',
    JoiningDate: '2023-05-10',
    Status: 'Active',
    CreatedAt: '2023-05-10 12:00:00',
  }
];

const totalItems = 100; // Total number of items (for example)
const itemsPerPage = 10; // Items per page

export default function Staff() {
  const [limit, setLimit] = useState<number>(10); // Default limit
  const [currentPage, setCurrentPage] = useState(0);

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


  const handlePagination = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected); // Update current page
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    console.log('Selected limit:', newLimit); // Handle limit change as needed
  };

  return (
    <div className="h-full">
      <div className="mb-6 p-1 shadow-lg bg-white flex justify-center">
        <div className="container py-1">
          <StaffFilterForm handleSelect={handleSelect} filters={filters} />
        </div>
      </div>
      <div className="flex justify-center">
        <div className='shadow-lg container rounded-lg m-2 p-1'>

          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold">Staff ({staffData.length})</span>
            <div className=" w-80 ">
              <SearchInput placeholder="Search Staff"
                className="p-2"
              />
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

          <table className="min-w-full table-auto border-collapse p-2">
            <thead>
              <tr className="bg-gray-200 text-gray-600 text-left text-sm uppercase">
                {
                  cols?.map(col => {
                    return (
                      <th key={col} className="p-2">{col}</th>
                    )
                  })
                }
              </tr>
            </thead>
            <tbody>
              {staffData.map((item) => (
                <tr
                  key={item.EmpID}
                  className="border-b text-sm hover:bg-gray-100 transition-colors"
                >
                  <td className="p-2">{item.Name}</td>
                  <td className="p-2">{item.EmpID}</td>
                  <td className="p-2">{item.Designation}</td>
                  <td className="p-2">{item.Department}</td>
                  <td className="p-2">{item.JoiningDate}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded-lg text-sm ${item.Status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {item.Status}
                    </span>
                  </td>
                  <td className="p-2">{item.CreatedAt}</td>
                  <td className="p-1 space-x-2">
                    <EditStaff item={item} />
                    <DeleteStaff item={item} />
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

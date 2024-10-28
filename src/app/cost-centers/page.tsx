'use client';

import { useState } from "react";
import SearchInput from "~/app/_components/searchInput";
import PaginationLimitSelect from "~/app/_components/pagination/limit";
import ReactPaginationStyle from "~/app/_components/pagination/pagination";
import DepartmentFilterForm from "./filter";
import EditCostCenters from "./edit";
import DeleteCostCenters from "./delete";

const cols = ['Name', 'Code', 'Type', 'Created At', 'actions']

const records = [
  {
    Name: 'Human Resources',
    Code: 'HR001',
    Type: 'FC',
    CreatedAt: '2020-03-15 09:00:00',
  },
  {
    Name: 'Finance',
    Code: 'FIN002',
    Type: 'FC',
    CreatedAt: '2019-07-21 14:20:00',
  },
  {
    Name: 'Marketing',
    Code: 'MKT003',
    Type: 'FC',
    CreatedAt: '2021-02-18 11:45:00',
  },
  {
    Name: 'Sales',
    Code: 'SAL004',
    Type: 'FC',
    CreatedAt: '2018-05-25 16:30:00',
  },
  {
    Name: 'Research and Development',
    Code: 'RND005',
    Type: 'NFC',
    CreatedAt: '2020-12-05 10:10:00',
  },
  {
    Name: 'Customer Support',
    Code: 'CST006',
    Type: 'FC',
    CreatedAt: '2019-11-15 08:50:00',
  },
  {
    Name: 'Information Technology',
    Code: 'IT007',
    Type: 'NFC',
    CreatedAt: '2022-04-01 13:15:00',
  },
  {
    Name: 'Legal',
    Code: 'LEG008',
    Type: 'FC',
    CreatedAt: '2017-09-10 17:05:00',
  },
  {
    Name: 'Product Management',
    Code: 'PM009',
    Type: 'NFC',
    CreatedAt: '2021-08-12 12:30:00',
  },
  {
    Name: 'Logistics',
    Code: 'LOG010',
    Type: 'FC',
    CreatedAt: '2019-03-08 09:20:00',
  }
];

const totalItems = 100; // Total number of items (for example)
const itemsPerPage = 10; // Items per page

export default function CostCentersReport() {
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
      <div className="mb-6 p-2 shadow-lg bg-white flex justify-center">
        <div className="container">
          <DepartmentFilterForm filters={filters} handleSelect={handleSelect} />
        </div>
      </div>
      <div className="flex justify-center">
        <div className='shadow-lg container rounded-lg m-2 p-2'>

          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold">Cost Centers ({records.length})</span>
            <div className=" w-80 ">
              <SearchInput placeholder="Search Cost Centers"
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
                    return <th key={col} className="p-2">{col}</th>
                  })
                }
              </tr>
            </thead>
            <tbody>
              {records.map((item) => (
                <tr
                  key={item.CreatedAt}
                  className="border-b text-sm hover:bg-gray-100 transition-colors"
                >
                  <td className="p-2">{item.Name}</td>
                  <td className="p-2">{item.Code}</td>
                  <td className="p-2">{item.Type}</td>
                  <td className="p-2">{item.CreatedAt}</td>
                  <td className="space-x-2">
                    <EditCostCenters item={item} />
                    <DeleteCostCenters item={item} />
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

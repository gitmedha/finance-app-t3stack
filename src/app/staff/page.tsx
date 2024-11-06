'use client';

import { useState } from "react";
import SearchInput from "~/app/_components/searchInput";
import PaginationLimitSelect from "~/app/_components/pagination/limit";
import ReactPaginationStyle from "~/app/_components/pagination/pagination";
import StaffFilterForm from "./filter";
import EditStaff from "./edit";
import DeleteStaff from "./delete";
import { api } from "~/trpc/react";
import type { GetStaffsResponse, Staff } from "./staff";

const cols = ['Name', 'Emp ID', 'Designation', 'Department', 'Joining Date', 'Status', 'Created At', 'actions']

export default function Staff() {
  const [limit, setLimit] = useState<number>(10); // Default limit
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, refetch } = api.get.getStaffs.useQuery({ page: currentPage, limit })

  const result: GetStaffsResponse | undefined = data;

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
            <span className="font-semibold">Staff ({result?.staffs ? result.totalCount : ''})</span>
            <div className=" w-80 ">
              <SearchInput placeholder="Search Staff"
                className="p-2"
              />
            </div>
            <div className="flex justify-end items-center space-x-2">
              {result?.staffs && <ReactPaginationStyle
                total={result?.totalCount}
                currentPage={currentPage}
                handlePagination={handlePagination}
                limit={limit}
              />}

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
              {result?.staffs && result?.staffs.map((item: Staff) => (
                <tr
                  key={item?.id}
                  className="border-b text-sm hover:bg-gray-100 transition-colors"
                >
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.empNo}</td>
                  <td className="p-2">{item.description}</td>
                  <td className="p-2">{item.department}</td>
                  <td className="p-2">{item.createdAt}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded-lg text-sm ${item.isactive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {item.isactive ? 'Active' : 'InActive'}
                    </span>
                  </td>
                  <td className="p-2">{item.createdAt}</td>
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

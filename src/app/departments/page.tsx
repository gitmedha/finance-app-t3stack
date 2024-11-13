'use client';

import { useEffect, useState } from "react";
import SearchInput from "~/app/_components/searchInput";
import PaginationLimitSelect from "~/app/_components/pagination/limit";
import ReactPaginationStyle from "~/app/_components/pagination/pagination";
import DepartmentFilterForm from "./filter";
import EditDepartments from "./edit";
import DeleteDepartment from "./delete";
import { api } from "~/trpc/react";
import type { GetDepartmentResponse, Department } from "./department";
import AddDepartment from "./add";

const cols = ['Name', 'Code', 'Type', 'Status', 'Created At', 'Actions']

export default function DepartmentReport() {
  const [limit, setLimit] = useState<number>(10); // Default limit
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearch] = useState('')

  const [filters, setFilters] = useState({
    status: 'Active',
    type: '',
  });


  // Fetch data with pagination
  const { data, isLoading, refetch } = api.get.getDepartments.useQuery(
    { page: currentPage, limit, searchTerm , ...filters},
    { enabled: false } // Disable automatic query execution
  );

  // Trigger refetch on page or limit change
  useEffect(() => {
    refetch();
  }, [currentPage, limit, searchTerm, refetch, filters]);

  const result: GetDepartmentResponse | undefined = data;

  const handleSearch = (e: any) => {
    const debounceTimer = setTimeout(() => {
      if (e.target.value.trim().length > 2) {
        setSearch(e.target.value.trim())
      } else if (e.target.value.trim().length === 0) {
        setSearch('')
      }
    }, 1500)
    return () => {
      clearTimeout(debounceTimer)
    }
  }
  const handleSelect = (name: string, value: object) => {
    setFilters((prev) => ({
      ...prev,
      [name]: (value as any).value,
    }));
  };

  const handlePagination = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected + 1);
  };


  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
  };

  return (
    <div className="h-full">
      <div className="flex justify-center mt-8">
      <div className='min-h-[400px] container p-4 mt-6 lg:mt-0 rounded shadow bg-white'>
          <div className="flex justify-between items-center mb-1 px-2">
            <div className="flex justify-start items-center space-x-2">
              <span className="font-semibold">Count: {result?.departments ? result.totalCount : ''}</span>
              <div className=" w-[200px] ">
                <SearchInput placeholder="Search departments"
                  className="p-2"
                  onChange={handleSearch}
                />
              </div>
              <DepartmentFilterForm filters={filters} handleSelect={handleSelect} />
            </div>

            <div className="flex justify-end items-center space-x-2">
              {result?.departments && <ReactPaginationStyle
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
              <AddDepartment />
            </div>
          </div>

          {isLoading ? <div className='w-full flex justify-center items-center h-[46vh]'>
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div> : (result?.departments && <table className="  min-w-full table-auto border-collapse p-2">
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
              {result?.departments.map((item: Department) => (
                <tr
                  key={item?.id}
                  className="border-b text-sm hover:bg-gray-100 transition-colors"
                >
                  <td className="p-2">{item.departmentname}</td>
                  <td className="p-2">{item.deptCode}</td>
                  <td className="p-2">{item.type}</td>
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
                  <td className="p-1.5 space-x-2">
                    <EditDepartments item={item} />
                    <DeleteDepartment item={item} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>)}
        </div>
      </div>
    </div>
  );
}

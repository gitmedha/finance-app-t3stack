'use client';

import { useEffect, useState } from "react";
import SearchInput from "~/app/_components/searchInput";
import PaginationLimitSelect from "~/app/_components/pagination/limit";
import ReactPaginationStyle from "~/app/_components/pagination/pagination";
import { api } from "~/trpc/react";
import type { costCenters, GetcostCentersResponse, SelectValue } from "./cost-center";
import EditCostCenters from "./edit";
import DeleteCostCenters from "./delete";
import CostCenterFilterForm from "./filter";
import AddCostCenters from "./add";
import moment from "moment";

const cols = ['Name', 'Code', 'Type','Status' ,'Created At', 'actions']

export default function CostCenter() {
  const [limit, setLimit] = useState<number>(10); // Default limit
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: 'Active',
    type: '',
  });


  const [searchTerm, setSearch] = useState('')

  // Fetch data with pagination
  const { data, isLoading, refetch } = api.get.getCostCenters.useQuery(
    { page: currentPage, limit, searchTerm, ...filters },
    { enabled: false } // Disable automatic query execution
  );

  // Trigger refetch on page or limit change
  useEffect(() => {
    void refetch();
  }, [currentPage, limit, searchTerm, refetch, filters]);

  const result: GetcostCentersResponse | undefined = data;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSelect = (name: string, value: SelectValue) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value.value, // No need for `any` type
    }));
  };

  const handlePagination = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
  };

  return (
    <div className="mt-5 flex justify-center">
      <div className='min-h-[400px] container p-4 mt-6 lg:mt-0 rounded shadow bg-white'>
        <div className="w-full flex justify-between items-center mb-1 px-2">
          <div className="w-full flex justify-start items-center space-x-2">
            <span className="font-semibold">Count: {result?.costCenters ? result.totalCount : ''}</span>
            <div className=" w-[200px] ">
              <SearchInput placeholder="Search Cost Center"
                className="p-2"
                onChange={handleSearch}
              />
            </div>
            <CostCenterFilterForm filters={filters} handleSelect={handleSelect} />
          </div>

          <div className="flex justify-end items-center space-x-2">
            {result?.costCenters && <ReactPaginationStyle
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

            <AddCostCenters />
          </div>
        </div>

        {isLoading ? <div className='w-full flex justify-center items-center h-[46vh]'>
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div> : (result?.costCenters && <table className="min-h-[calc(50vh)] min-w-full table-auto border-collapse p-2">
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
            {result?.costCenters.map((item: costCenters) => (
              <tr
                key={item?.id}
                className="border-b text-sm hover:bg-gray-100 transition-colors"
              >
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.description}</td>
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
                <td className="p-2">{moment(item.createdAt).format('DD-MM-YYYY')}</td>
                <td className="p-1.5 space-x-2">
                  <EditCostCenters item={item} />
                  <DeleteCostCenters item={item} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>)}
      </div>
    </div>
  );
}

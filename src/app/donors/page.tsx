'use client';

import { useEffect, useState } from "react";
import SearchInput from "~/app/_components/searchInput";
import PaginationLimitSelect from "~/app/_components/pagination/limit";
import ReactPaginationStyle from "~/app/_components/pagination/pagination";
import { api } from "~/trpc/react";
import type { GetDonorsResponse, Donors, SelectValue } from "./donor";
import EditDonor from "./edit";
import DeleteDonor from "./delete";
import DonorFilterForm from "./filter";
import AddDonors from "./add";
import moment from "moment";

const cols = ['Name', 'Cost Center', 'Year', 'Total Budget', 'Received Budget', 'Status', 'Currency', 'Type', 'Created At', 'actions']

export default function Donor() {
  const [limit, setLimit] = useState<number>(10); // Default limit
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
  });

  const [searchTerm, setSearch] = useState('')

  // 3. Safe API Query with Promise Handling
  const { data, isLoading, refetch } = api.get.getDonors.useQuery(
    { page: currentPage, limit, searchTerm, ...filters },
    { enabled: false }
  );

  // Trigger refetch on page or limit change
  useEffect(() => {
    void refetch(); // Ignore promise if you don't need to handle it
  }, [currentPage, limit, searchTerm, filters, refetch]);

  const result: GetDonorsResponse | undefined = data;

  // 2. Refactor debounce with proper event typing
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const debounceTimer = setTimeout(() => {
      const searchValue = e.target.value.trim();
      if (searchValue.length > 2) {
        setSearch(searchValue);
      } else if (searchValue.length === 0) {
        setSearch('');
      }
    }, 1500);

    return () => {
      clearTimeout(debounceTimer);
    };
  };

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
    <div className="h-full">
      <div className="flex justify-center mt-8">
        <div className='min-h-[400px] container p-4 mt-6 lg:mt-0 rounded shadow bg-white'>
          <div className="flex justify-between items-center mb-1 px-2">
            <div className="flex justify-start items-center space-x-2">
              <span className="font-semibold">Count: {result?.donors ? result.totalCount : ''}</span>
              <div className=" w-[200px] ">
                <SearchInput placeholder="Search Donor"
                  className="p-2"
                  onChange={handleSearch}
                />
              </div>
              <DonorFilterForm filters={filters} handleSelect={handleSelect} />
            </div>

            <div className="flex justify-end items-center space-x-2">
              {result?.donors && <ReactPaginationStyle
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
              <AddDonors />
            </div>
          </div>

          {isLoading ? <div className='w-full flex justify-center items-center h-[46vh]'>
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div> : (result?.donors && <table className="  min-w-full table-auto border-collapse p-2">
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
              {result?.donors.map((item: Donors) => (
                <tr
                  key={item?.id}
                  className="border-b text-sm hover:bg-gray-100 transition-colors"
                >
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.costCenterName}</td>
                  <td className="p-2">{item.finYear}</td>
                  <td className="p-2">{item.totalBudget}</td>
                  <td className="p-2">{item.budgetReceived}</td>
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
                  <td className="p-2">{item.currency}</td>
                  <td className="p-2">{item.type}</td>
                  <td className="p-2">{moment(new Date(item.createdAt)).format('DD-MM-YYYY')}</td>
                  <td className="p-1.5 space-x-2">
                    <EditDonor item={item} />
                    <DeleteDonor item={item} />
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

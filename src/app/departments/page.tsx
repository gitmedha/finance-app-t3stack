"use client";

import { useEffect, useState } from "react";
import SearchInput from "~/app/_components/searchInput";
import PaginationLimitSelect from "~/app/_components/pagination/limit";
import ReactPaginationStyle from "~/app/_components/pagination/pagination";
import DepartmentFilterForm from "./filter";
import EditDepartments from "./edit";
import DeleteDepartment from "./delete";
import { api } from "~/trpc/react";
import type {
  GetDepartmentResponse,
  Department,
  SelectValue,
} from "./department";
import AddDepartment from "./add";
import moment from "moment";
import ActivateDepartment from "./activate";

const cols = ["Name", "Code", "Type", "Status", "Created At", "Actions"];

export default function DepartmentReport() {
  const [limit, setLimit] = useState<number>(10); // Default limit
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearch] = useState("");

  const [filters, setFilters] = useState({
    status: "Active",
    type: "",
  });

  // Fetch data with pagination
  const { data, isLoading, refetch } = api.get.getDepartments.useQuery(
    { page: currentPage, limit, searchTerm, ...filters },
    { enabled: false }, // Disable automatic query execution
  );

  // Trigger refetch on page or limit change
  useEffect(() => {
    void refetch(); // Ignore promise if you don't need to handle it
  }, [currentPage, limit, searchTerm, refetch, filters]);

  const result: GetDepartmentResponse | undefined = data;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const debounceTimer = setTimeout(() => {
      if (e.target.value.trim().length > 2) {
        setSearch(e.target.value.trim());
      } else if (e.target.value.trim().length === 0) {
        setSearch("");
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
    <div className="mt-20 h-full">
      <div className="mt-8 flex justify-center">
        <div className="sm:(max-w-screen-sm mx-auto) + md:(max-w-screen-md) + lg:(max-w-screen-lg mt-0) mx-auto mt-6 min-h-[400px] w-full max-w-full rounded bg-white p-4 shadow">
          {/* search, filter and add department button */}
          <div className="mb-1 flex w-full flex-col space-y-4 bg-white px-2 py-2 md:flex-row md:justify-between md:space-x-4 md:space-y-0">
            {/* search and filter */}
            <div className="flex flex-col items-center space-y-2 md:flex-row md:space-x-2 md:space-y-0">
              <div className="flex items-center space-x-2">
              <span className="font-semibold">
                Count: {result?.departments ? result.totalCount : ""}
              </span>
              {/* search */}
              <div className="w-[200px]">
                <SearchInput
                  placeholder="Search departments"
                  className="p-2"
                  onChange={handleSearch}
                />
              </div>
              </div>
              {/* filter */}
              <DepartmentFilterForm
                filters={filters}
                handleSelect={handleSelect}
              />
            </div>

            {/* pagination and add department button */}
            <div className="flex items-center justify-center md:justify-end space-x-2">
              {result?.departments && (
                <ReactPaginationStyle
                  total={result?.totalCount}
                  currentPage={currentPage}
                  handlePagination={handlePagination}
                  limit={limit}
                />
              )}

              <PaginationLimitSelect
                limits={[10, 20, 50, 100]} // Define the limits you want to provide
                selectedLimit={limit}
                onLimitChange={handleLimitChange}
              />
              <AddDepartment refetch={refetch} />
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-[46vh] w-full items-center justify-center">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            </div>
          ) : (
            result?.departments && (
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-left text-sm uppercase text-gray-600">
                    {cols?.map((col) => {
                      return (
                        <th key={col} className={`p-2 ${col === "Code" || col === "Created At" ? "hidden md:table-cell" : ""}`}>
                          {col}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {result?.departments.map((item: Department) => (
                    <tr
                      key={item?.id}
                      className="border-b text-sm transition-colors hover:bg-gray-100"
                    >
                      <td className="p-2">{item.departmentname}</td>
                      <td className="hidden p-2 md:table-cell">{item.deptCode}</td>
                      <td className="p-2">{item.type}</td>
                      <td className="p-2">
                        <span
                          className={` rounded-lg px-2 py-1 text-sm ${
                            item.isactive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.isactive ? "Active" : "InActive"}
                        </span>
                      </td>
                      <td className="p-2 hidden md:table-cell">
                        {moment(item.createdAt).format("DD-MM-YYYY")}
                      </td>
                      {item.isactive ? (
                        <td className="space-x-2 p-1.5">
                          <EditDepartments item={item} refetch={refetch} />
                          <DeleteDepartment item={item} refetch={refetch} />
                        </td>
                      ) : (
                        <td>
                          <ActivateDepartment item={item} refetch={refetch} />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>
    </div>
  );
}

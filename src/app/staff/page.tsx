"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import SearchInput from "~/app/_components/searchInput";
import PaginationLimitSelect from "~/app/_components/pagination/limit";
import ReactPaginationStyle from "~/app/_components/pagination/pagination";
import StaffFilterForm from "./filter";
import EditStaff from "./edit";
import DeleteStaff from "./delete";
import AddStaff from "./add";
import { api } from "~/trpc/react";
import type { GetStaffsResponse, StaffItem } from "./staff";

const cols = [
  "Name",
  "Emp ID",
  "Nature of Employment",
  "Designation",
  "Department",
  "State",
  "Program",
  "Location",
  "Joining Date",
  "Status",
  "Actions",
];

export default function Staff() {
  const [limit, setLimit] = useState<number>(10); // Default limit
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearch] = useState("");

  const [filters, setFilters] = useState({
    department: 0,
    departmentname: "",
    status: "Active",
    designation: "",
  });

  const { data, isLoading, refetch } = api.get.getStaffs.useQuery(
    { page: currentPage, limit, searchTerm, ...filters },
    { enabled: false }, // Disable automatic query execution
  );

  // Trigger refetch on page or limit change
  useEffect(() => {
    const fetchData = async () => {
      await refetch();
    };
    void fetchData();
  }, [refetch, currentPage, filters, limit, searchTerm]);

  const result = data as GetStaffsResponse | undefined;

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

  /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */

  const handleSelect = (name: string, value: object) => {
    if (name === "department") {
      setFilters((prev) => ({
        ...prev,
        [name]: (value as any)?.id ?? 0, // Using 'any' with optional chaining
        departmentname: (value as any)?.departmentname, // Using 'any' with optional chaining
      }));
    } else if (name === "status") {
      setFilters((prev) => ({
        ...prev,
        [name]: (value as any)?.value, // Using 'any' with optional chaining
      }));
    } else if (name === "designation") {
      setFilters((prev) => ({
        ...prev,
        [name]: (value as any)?.designation, // Using 'any' with optional chaining
      }));
    }
  };

  /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */

  const handlePagination = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
  };

  return (
    <div className="mt-5 flex justify-center">
      <div className="container mt-6 min-h-[400px] rounded bg-white p-4 shadow lg:mt-0">
        <div className="mb-1 flex items-center justify-between px-2">
          <div className="flex items-center justify-start space-x-2">
            <span className="font-semibold">
              Count: {result?.staffs ? result.totalCount : ""}
            </span>
            <div className="w-[200px]">
              <SearchInput
                placeholder="Search Staff"
                className="p-2"
                onChange={handleSearch}
              />
            </div>
            <StaffFilterForm handleSelect={handleSelect} filters={filters} />
          </div>

          <div className="flex items-center justify-end space-x-2">
            {result?.staffs && (
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
            <AddStaff refetchStaffs={refetch} />
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
          result?.staffs && (
            <table className="min-w-full table-auto border-collapse p-2">
              <thead>
                <tr className="bg-gray-200 text-left text-sm uppercase text-gray-600">
                  {cols?.map((col) => {
                    return (
                      <th key={col} className="p-2">
                        {col}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {result?.staffs.map((item: StaffItem) => (
                  <tr
                    key={item?.id}
                    className="border-b text-sm transition-colors hover:bg-gray-100"
                  >
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.empNo}</td>
                    <td className="p-2">{item.nature_of_employment}</td>
                    <td className="p-2">{item.designation}</td>
                    <td className="p-2">{item.departmentname}</td>
                    <td className="p-2">{item.state}</td>
                    <td className="p-2">{item.program}</td>
                    <td className="p-2">{item.location}</td>
                    <td className="p-2">
                      {moment(item.createdAt).format("DD/MM/YYYY")}
                    </td>
                    <td className="p-2">
                      <span
                        className={`rounded-lg px-2 py-1 text-sm ${
                          item.isactive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.isactive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="space-x-2 p-1">
                      <EditStaff item={item} refetchStaffs={refetch} />
                      <DeleteStaff item={item} refetchStaffs={refetch} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}

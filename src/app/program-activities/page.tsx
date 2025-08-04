"use client";

import { useEffect, useState } from "react";
import SearchInput from "~/app/_components/searchInput";
import PaginationLimitSelect from "~/app/_components/pagination/limit";
import ReactPaginationStyle from "~/app/_components/pagination/pagination";
import ProgramActivityFilterForm from "./filter";
import AddName from "./add";
import { api } from "~/trpc/react";
import type {
  GetProgramActivitiesResponse,
  ProgramActivityItem,
  FilterName,
  Option,
  FilterValues,
} from "./program-activity";
import { useSession } from "next-auth/react";
import ActivateProgramActivity from "./activate";
import EditProgramActivity from "./edit";
import DeleteProgramActivity from "./delete";
import moment from "moment";
const cols = [
  "Name",
  "Department",
  "SubDepartment",
  "Created At",
  "Status",
  // "Budget",
  "Actions",
];

export default function ProgramActivities() {
  const userData = useSession();
  const [limit, setLimit] = useState<number>(10); // Default limit
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearch] = useState("");

  // Function to get current financial year
  function getCurrentFinancialYear() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    return month >= 3
      ? `${year}-${(year + 1).toString().slice(2)}`
      : `${year - 1}-${year.toString().slice(2)}`;
  }

  const [filters, setFilters] = useState<FilterValues>({
    department: userData.data?.user.departmentId ?? 0,
    departmentname: userData.data?.user.departmentName ?? "",
    status: "Active",
    subdepartment: userData.data?.user.subDepartmentId ?? 0,
    subdepartmentname: userData.data?.user.subDepartmentName ?? "",
    financialYear: getCurrentFinancialYear(),
  });

  // Fix: Only pass known properties to useQuery as per the type error.
  const { data, isLoading, refetch } = api.get.getProgramActivity.useQuery(
    {
      page: currentPage,
      limit,
      searchTerm,
      departmentId: filters.department,
      subDepartmentId: filters.subdepartment,
      status: filters.status,
      financialYear: filters.financialYear,
    },
    // { enabled: false },
  );

  useEffect(() => {
    const fetchData = async () => {
      await refetch();
    };
    void fetchData();
  }, [
    refetch,
    currentPage,
    limit,
    searchTerm,
    filters.department,
    filters.subdepartment,
    filters.status,
    filters.financialYear,
  ]);

  // Cast to unknown first to avoid type error
  const result = data as GetProgramActivitiesResponse | undefined;

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

  const handleSelect = (name: FilterName, opt: Option) => {
    setFilters((prev) => {
      // Base update: set the field itself
      const updates: Partial<typeof prev> = {
        [name]: opt.value,
      };

      if (name === "department") {
        updates.departmentname = opt.label;
      } else if (name === "subdepartment") {
        updates.subdepartmentname = opt.label;
      }

      return { ...prev, ...updates };
    });
  };

  const handlePagination = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
  };
  console.log(result?.activities, "result");
  return (
    <div className="mt-20 flex justify-center">
      <div className="container mt-6 min-h-[400px] min-w-full rounded bg-white px-3 py-4 shadow lg:mt-0">
        <div className="mb-1 flex w-full flex-col items-center space-y-4 px-1 md:flex-row md:justify-between md:space-x-4 md:space-y-0">
          <div className="flex w-full flex-col items-center justify-center space-y-2 md:flex-row md:items-center md:justify-start md:space-x-2 md:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Count: {result?.totalCount}</span>
              <div className="w-[200px]">
                <SearchInput
                  placeholder="Search Program Activity"
                  className="p-2"
                  onChange={handleSearch}
                />
              </div>
            </div>
            <ProgramActivityFilterForm
              handleSelect={handleSelect}
              filters={filters}
            />
          </div>

          <div className="flex items-center justify-center space-x-2 md:justify-end">
            {result?.activities && (
              <ReactPaginationStyle
                total={result?.totalCount}
                currentPage={currentPage}
                handlePagination={handlePagination}
                limit={limit}
              />
            )}

            <PaginationLimitSelect
              limits={[10, 20, 50, 100]}
              selectedLimit={limit}
              onLimitChange={handleLimitChange}
            />
            {<AddName refetch={refetch} />}
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
          result?.activities && (
            <>
              {/* 1. Mobile cards (<640px) */}
              <div className="sm:hidden">
                {result?.activities.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b p-4"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Department: {item.departmentData?.label}
                      </p>
                      <p className="text-sm text-gray-600">
                        Sub-Dept: {item.subDepartmentData?.label}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {item.isActive ? (
                        <>
                          <EditProgramActivity item={item} refetch={refetch} />
                          <DeleteProgramActivity
                            item={item}
                            refetchProgramActivities={refetch}
                          />
                        </>
                      ) : (
                        <ActivateProgramActivity
                          item={item}
                          refetchProgramActivities={refetch}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 2. Table on ≥640px */}
              <div className="hidden w-full overflow-x-auto sm:block">
                <table className="w-full min-w-full table-auto border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-200 text-left text-sm uppercase text-gray-600">
                      <th className="whitespace-nowrap p-2">Name</th>
                      <th className="hidden whitespace-nowrap p-2 sm:table-cell">
                        Department
                      </th>
                      <th className="hidden whitespace-nowrap p-2 sm:table-cell">
                        SubDepartment
                      </th>
                      <th className="whitespace-nowrap p-2">Created At</th>
                      <th className="whitespace-nowrap p-2">Status</th>
                      <th className="hidden whitespace-nowrap p-2 sm:table-cell">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result?.activities.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b text-sm transition-colors hover:bg-gray-100"
                      >
                        <td className="whitespace-nowrap p-2">{item.name}</td>
                        <td className="hidden whitespace-nowrap p-2 sm:table-cell">
                          {item.departmentData?.label}
                        </td>
                        <td className="hidden whitespace-nowrap p-2 sm:table-cell">
                          {item.subDepartmentData?.label}
                        </td>
                        <td className="whitespace-nowrap p-2">
                          {moment(item.createdAt).format("DD-MM-YYYY")}
                        </td>
                        <td className="whitespace-nowrap p-2">
                          <span
                            className={`rounded-lg px-2 py-1 text-sm ${
                              item.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="hidden whitespace-nowrap p-2 sm:table-cell">
                          {item.isActive ? (
                            <div className="flex space-x-2">
                              <EditProgramActivity
                                item={item}
                                refetch={refetch}
                              />
                              <DeleteProgramActivity
                                item={item}
                                refetchProgramActivities={refetch}
                              />
                            </div>
                          ) : (
                            <ActivateProgramActivity
                              item={item}
                              refetchProgramActivities={refetch}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}

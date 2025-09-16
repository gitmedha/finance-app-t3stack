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
import { useSession } from "next-auth/react";
import ViewStaff from "./view";
import ActivateStaff from "./activate";

const cols = [
  "Name",
  "Emp ID",
  "Type",
  "Designation",
  "Project",
  "Department",
  "SubDepartment",
  "Level",
  "State",
  "Location",
  "Joining",
  "Status",
  "Actions",
];

export default function Staff() {
  const userData = useSession();
  console.log("🚀 userData:", userData);
  const [limit, setLimit] = useState<number>(10); // Default limit
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearch] = useState("");

  const [filters, setFilters] = useState({
    department: userData.data?.user.departmentId
      ? userData.data?.user.departmentId
      : 0,
    departmentname: userData.data?.user.departmentName
      ? userData.data?.user.departmentName
      : "",
    status: "Active",
    level: 0,
    subdepartment: userData.data?.user.subDepartmentId ?? 0,
    subdepartmentname: userData.data?.user.subDepartmentName ?? "",
    tbhPrefix: "" as "" | "TBH",
  });
  console.log("🚀 filters:", filters);

  const { data, isLoading, refetch } = api.get.getStaffs.useQuery(
    { page: currentPage, limit, searchTerm, ...filters },
    // { enabled: false },
  );

  useEffect(() => {
    const fetchData = async () => {
      await refetch();
    };
    void fetchData();
  }, [refetch, currentPage, filters, limit, searchTerm]);

  useEffect(() => {
    if (data) {
      console.log("Frontend received data:", data);
    }
  }, [data]);
  useEffect(() => {
    console.log("🚀 session:", userData);
  }, []);

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
    console.log("🚀 name:", name);
    console.log("🚀 value:", value);
    if (name === "department") {
      setFilters((prev) => ({
        ...prev,
        [name]: (value as any)?.value ?? 0, // Using 'any' with optional chaining
        departmentname: (value as any)?.label, // Using 'any' with optional chaining
      }));
    } else if (name == "subdepartment") {
      setFilters((prev) => ({
        ...prev,
        [name]: (value as any)?.value ?? 0, // Using 'any' with optional chaining
        subdepartmentname: (value as any)?.label, // Using 'any' with optional chaining
      }));
    } else if (name === "status") {
      setFilters((prev) => ({
        ...prev,
        [name]: (value as any)?.value, // Using 'any' with optional chaining
      }));
    } else if (name === "level") {
      setFilters((prev) => ({
        ...prev,
        [name]: (value as any)?.value, // Using 'any' with optional chaining
      }));
    } else if (name === "tbhPrefix") {
      setFilters((prev) => ({
        ...prev,
        [name]: (value as any)?.value, // Using 'any' with optional chaining
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

  const filteredStaffs =
  (result?.staffs ?? []).filter((s) => {
    if (!filters.tbhPrefix) return true; // ALL
    const dn = s.name || "";
    return dn.slice(0, 3).toLowerCase() === "tbh"; // TBH only
  });

  console.log("🚀 filteredStaffs:", filteredStaffs);
  console.log("🚀 result:", result);

  return (
    <div className="mt-20 flex justify-center">
      <div className="container mt-6 min-h-[400px] min-w-full rounded bg-white px-3 py-4 shadow lg:mt-0">
        <div className="mb-1 flex w-full flex-col space-y-4 bg-white px-2 py-2 md:flex-row md:justify-between md:space-x-4 md:space-y-0">
          <div className="flex flex-col items-center space-y-2 md:flex-row md:space-x-2 md:space-y-0">
            <div className="flex items-center space-x-2">
            {/* count */}
            <span className="text-medium font-semibold whitespace-nowrap">Count: {result?.totalCount}</span>
            {/* search */}
            <div className="w-[180px]">
              <SearchInput
                placeholder="Search Staff"
                className="p-2"
                onChange={handleSearch}
              />
            </div>
            </div>
            {/* filter */}
            <StaffFilterForm handleSelect={handleSelect} filters={filters} />
          </div>
          {/* pagination and add staff button */}
          <div className="flex items-center justify-center space-x-2 md:justify-end">
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
            {(userData.data?.user.role == 1 || userData.data?.user.role == 2 || userData.data?.user.role == 3) && <AddStaff refetch={refetch} />}
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
            filteredStaffs && (
            <>
              {/* 1. Mobile view: show cards only on <640px */}
              <div className="sm:hidden">
                {filteredStaffs.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b p-4"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.designation}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <ViewStaff item={item} refetch={refetch} />
                      {(userData.data?.user.role === 1 || userData.data?.user.role === 2 || userData.data?.user.role === 3) && (
                        <>
                          <EditStaff item={item} refetch={refetch} />
                          <DeleteStaff item={item} refetchStaffs={refetch} />
                        </>
                      )}
                      {!item.isactive && (
                        <ActivateStaff item={item} refetchStaffs={refetch} />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 2. Tablet+ view: show full table on ≥640px */}
              <div className="hidden w-full overflow-x-auto sm:block">
                <table className="w-full min-w-[1200px] table-fixed border border-gray-200">
                  <thead>
                    <tr className="bg-gray-200 text-left text-sm uppercase text-gray-600">
                      {cols?.map((col, key) => {
                        const widthMapping: Record<number, string> = {
                          0: "w-[100px]",
                          1: "w-[80px]",
                          2: "w-[80px]",
                          3: "w-[120px]",
                          4: "w-[120px]",
                          5: "w-[120px]",
                          6: "w-[140px]",
                          7: "w-[100px]",
                          8: "w-[100px]",
                          9: "w-[100px]",
                          10: "w-[90px]",
                          11: "w-[80px]",
                          12: "w-[120px]",
                        };
                        return (
                          <th
                            key={col}
                            className={`p-2 ${widthMapping[key] ?? ""}`}
                          >
                            {col.toLowerCase()}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaffs.map((item: StaffItem) => (
                      <tr
                        key={item.id}
                        className="border-b text-sm transition-colors hover:bg-gray-100"
                      >
                        <td className="p-2">{item.name}</td>
                        <td className="p-2">{item.empNo}</td>
                        <td className="p-2">{item.nature_of_employment}</td>
                        <td className="p-2">{item.designation}</td>
                        <td className="p-2">{item.project}</td>
                        <td className="p-2">{item.departmentname}</td>
                        <td className="p-2">{item.subDeptData?.label}</td>
                        <td className="p-2">{item.levelData?.label}</td>
                        <td className="p-2">{item.state}</td>
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
                        <td className="w-[120px] space-x-2 p-1">
                          {item.isactive ? (
                            <>
                              <ViewStaff item={item} refetch={refetch} />
                              {(userData.data?.user.role === 1 || userData.data?.user.role === 2 || userData.data?.user.role === 3) && (
                                <EditStaff item={item} refetch={refetch} />
                              )}
                              {(userData.data?.user.role === 1 || userData.data?.user.role === 2 || userData.data?.user.role === 3) && (
                                <DeleteStaff
                                  item={item}
                                  refetchStaffs={refetch}
                                />
                              )}
                            </>
                          ) : (
                            <ActivateStaff
                              item={item}
                              refetchStaffs={refetch}
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

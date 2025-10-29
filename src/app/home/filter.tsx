import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useEffect } from "react";
import type { HomeFilterFormProps } from "./home";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";

const HomeFilterForm: React.FC<HomeFilterFormProps> = ({
  filters,
  handleSelect,
}) => {
 

  const userData = useSession();
  // Fetch data for departments
  const { data } = api.get.getDepartments.useQuery(
    { page: 1, limit: 100, type: "Department" },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 0,
    },
  );
  const { data: subdepartmentData } = api.get.getSubDepts.useQuery(
    { deptId: Number(filters.departmentId) },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 0,
      enabled: !!filters.departmentId,
    },
  );
  // Define years from 2023-24 to 2029-30
  const years = [
    "2023-24",
    "2024-25",
    "2025-26",
    "2026-27",
    "2027-28",
    "2028-29",
    "2029-30",
  ];

  const quarters = ["All", "Q1", "Q2", "Q3", "Q4"];

  useEffect(() => {
    if (userData.data?.user.departmentId && userData.data?.user.departmentName)
      handleSelect("department", {
        id: userData.data?.user.departmentId,
        departmentname: userData.data?.user.departmentName,
      });
    if (
      userData.data?.user.subDepartmentId &&
      userData.data?.user.subDepartmentName
    )
      handleSelect("subdepartment", {
        id: userData.data?.user.subDepartmentId,
        departmentname: userData.data?.user.subDepartmentName,
      });
  }, [userData]);
  useEffect(() => {
    if (userData.data?.user.role != 3)
      handleSelect("subdepartment", { id: 0, departmentname: "All" });
  }, [filters.departmentId]);
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center justify-start space-x-4">
          {/* Year Dropdown */}
          <div className="flex w-52 flex-col gap-1">
            <label
              htmlFor="year-dropdown"
              className="text-md font-medium text-gray-700"
            >
              Select Year :
            </label>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="text-md flex w-full cursor-pointer items-center justify-between rounded-lg border-2 border-green-700 py-1 pl-2 text-left font-normal text-gray-500">
                  <span>{filters.year || "Select Year"}</span>
                  <RiArrowDropDownLine size={30} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="max-h-56 !w-[220px] overflow-y-scroll rounded-lg bg-white p-2 shadow-lg">
                {years.map((year) => (
                  <DropdownMenu.Item
                    key={year}
                    className="cursor-pointer rounded p-2 hover:bg-gray-100 focus:ring-0"
                    onSelect={() => handleSelect("year", year)} // Set selected year
                  >
                    {year}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
          {/* Department */}
          <div className="flex w-52 flex-col gap-1">
            <label
              htmlFor="department-dropdown"
              className="text-md font-medium text-gray-700"
            >
              Select Department :
            </label>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="text-md flex w-full cursor-pointer items-center justify-between rounded-lg border-2 border-green-700 py-1 pl-2 text-left font-normal text-gray-500">
                  <span>{filters.departmentname}</span>
                  <RiArrowDropDownLine size={30} />
                </button>
              </DropdownMenu.Trigger>
              {/* drop down only when user role is 1 that means when the user is admin */}
              {userData.data?.user.role == 1 && (
                <DropdownMenu.Content className="max-h-56 !w-[220px] overflow-y-scroll rounded-lg bg-white p-2 shadow-lg">
                  <DropdownMenu.Item
                    // key={}
                    className="cursor-pointer rounded p-2 hover:bg-gray-100 focus:ring-0"
                    onSelect={() =>
                      handleSelect("department", {
                        id: 0,
                        departmentname: "All",
                      })
                    } // Set selected year
                  >
                    ALL
                  </DropdownMenu.Item>
                  {data?.departments
                    ?.sort((a, b) =>
                      a.departmentname.localeCompare(b.departmentname),
                    ) // Sorting alphabetically by department name
                    .map((dep) => (
                      <DropdownMenu.Item
                        key={dep.id}
                        className="cursor-pointer rounded p-2 hover:bg-gray-100 focus:ring-0"
                        onSelect={() =>
                          handleSelect("department", {
                            id: dep.id,
                            departmentname: dep.departmentname,
                          })
                        } // Pass entire department object
                      >
                        {dep.departmentname}
                      </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
              )}
            </DropdownMenu.Root>
          </div>
          {/* Sub department dropdown */}
          <div className="w-58 flex flex-col gap-1">
            <label
              htmlFor="sub-department-dropdown"
              className="text-md font-medium text-gray-700"
            >
              Select Sub Department :
            </label>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="text-md flex !w-[352px] cursor-pointer items-center justify-between rounded-lg border-2 border-green-700 py-1 pl-2 text-left font-normal text-gray-500">
                  <span>{filters.subdepartmentName}</span>
                  <RiArrowDropDownLine size={30} />
                </button>
              </DropdownMenu.Trigger>
              {/* drop down only when user role is 1 that means when the user is admin */}
              {userData.data?.user.role != 3 && (
                <DropdownMenu.Content className="max-h-56 !w-[356px] overflow-y-scroll rounded-lg bg-white p-1 shadow-lg">
                  <DropdownMenu.Item
                    // key={dep.id}
                    className="cursor-pointer rounded p-2 hover:bg-gray-100 focus:ring-0"
                    onSelect={() =>
                      handleSelect("subdepartment", {
                        id: 0,
                        departmentname: "ALL",
                      })
                    } // Pass entire department object
                  >
                    ALL
                  </DropdownMenu.Item>
                  {subdepartmentData?.subdepartments
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((dep) => (
                      <DropdownMenu.Item
                        key={dep.id}
                        className="cursor-pointer rounded p-2 hover:bg-gray-100 focus:ring-0"
                        onSelect={() =>
                          handleSelect("subdepartment", {
                            id: dep.id,
                            departmentname: dep.name,
                          })
                        } // Pass entire department object
                      >
                        {dep.name}
                      </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
              )}
            </DropdownMenu.Root>
          </div>
          {/* Quarter Dropdown */}
          <div className="flex w-52 flex-col gap-1">
            <label
              htmlFor="quarter-dropdown"
              className="text-md font-medium text-gray-700"
            >
              Select Quarter :
            </label>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="text-md flex w-full cursor-pointer items-center justify-between rounded-lg border-2 border-green-700 py-1 pl-2 text-left font-normal text-gray-500">
                  <span>{filters?.quarter || "Select Quarter"}</span>
                  <RiArrowDropDownLine size={30} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="max-h-56 !w-[220px] overflow-y-scroll rounded-lg bg-white p-2 shadow-lg"> 
                {quarters.map((quarter) => (
                  <DropdownMenu.Item
                    key={quarter}
                    className="cursor-pointer rounded p-2 hover:bg-gray-100 focus:ring-0"
                    onSelect={() => handleSelect("quarter", quarter)}
                  >
                    {quarter}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeFilterForm;

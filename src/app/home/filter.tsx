import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { RiArrowDropDownLine } from "react-icons/ri";
import { useEffect} from 'react';
import type { HomeFilterFormProps } from "./home";
import { api } from "~/trpc/react";
import { useSession } from 'next-auth/react';

const HomeFilterForm: React.FC<HomeFilterFormProps> = ({ filters, handleSelect }) => {
    const userData = useSession()
    // Fetch data for departments
    const { data } = api.get.getDepartments.useQuery(
        { page: 1, limit: 100, type: 'Department' },
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            staleTime: 0,
        }
    );
    const { data: subdepartmentData } = api.get.getSubDepts.useQuery({ deptId: Number(filters.department) }, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: 0,
        enabled: !!filters.department
    })
    // Define years from 2023-24 to 2029-30
    const years = [
        "2023-24", "2024-25", "2025-26", "2026-27",
        "2027-28", "2028-29", "2029-30",
    ];    

    useEffect(() => {
        if (userData.data?.user.departmentId && userData.data?.user.departmentName)
            handleSelect("department", { id: userData.data?.user.departmentId, departmentname: userData.data?.user.departmentName })
        if (userData.data?.user.subDepartmentId && userData.data?.user.subDepartmentName)
            handleSelect("subdepartment", { id: userData.data?.user.subDepartmentId, departmentname: userData.data?.user.subDepartmentName })
    }, [userData])
    useEffect(() => {
        handleSelect("subdepartment", { id: 0, departmentname: "All" })
    }, [filters.department])

    // useEffect(() => {
    //     if (!userData.data?.user.departmentId && !userData.data?.user.departmentName) {
    //         if (data?.departments?.length) {
    //             const sortedDepartments = [...data.departments].sort((a, b) =>
    //                 a.departmentname.localeCompare(b.departmentname)
    //             );
    //             if (sortedDepartments[0]) {
    //                 handleSelect("department", { id: sortedDepartments[0].id, departmentname: sortedDepartments[0].departmentname })
    //             }
    //         }
    //     }

    // }, [data]);

    // useEffect(() => {
    //     if (!userData.data?.user.subDepartmentId && !userData.data?.user.subDepartmentName) {
    //         if (subdepartmentData?.subdepartments?.length) {
    //             const sortedDepartments = [...subdepartmentData.subdepartments].sort((a, b) =>
    //                 a.name.localeCompare(b.name)
    //             );
    //             if (sortedDepartments[0]) {
    //                 handleSelect("subdepartment", { id: sortedDepartments[0].id, departmentname: sortedDepartments[0].name })
    //             }
    //         }
    //     }
    // }, [subdepartmentData])


    return (
        <div>
            <div className='flex justify-between'>
                <div className="flex justify-start items-center space-x-4">

                    {/* Year Dropdown */}
                    <div className="w-52 flex flex-col gap-1">
                        <label htmlFor="year-dropdown" className="text-sm font-medium text-gray-700">
                            Select Year :
                        </label>
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <button className="cursor-pointer w-full py-1 border-2 rounded-lg text-left text-gray-500 text-md pl-2 font-normal flex justify-between items-center border-green-700 ">
                                    <span>
                                        {filters.year || 'Select Year'}
                                    </span>
                                    <RiArrowDropDownLine size={30} />
                                </button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
                                {years.map((year) => (
                                    <DropdownMenu.Item
                                        key={year}
                                        className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                                        onSelect={() => handleSelect('year', year)} // Set selected year
                                    >
                                        {year}
                                    </DropdownMenu.Item>
                                ))}
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </div>
                    {/* Department */}
                    <div className="w-52 flex flex-col gap-1">
                        <label htmlFor="department-dropdown" className="text-sm font-medium text-gray-700">
                            Select Department :
                        </label>
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <button className="cursor-pointer w-full py-1 border-2 border-green-700 rounded-lg text-left text-gray-500 text-md pl-2 font-normal flex justify-between items-center">
                                    <span>{filters.departmentname}</span>
                                    <RiArrowDropDownLine size={30} />
                                </button>
                            </DropdownMenu.Trigger>
                            {/* drop down only when user role is 1 that means when the user is admin */}
                            {
                                userData.data?.user.role == 1 && <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
                                    <DropdownMenu.Item
                                        // key={}
                                        className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                                        onSelect={() => handleSelect('department', { id: 0, departmentname:"All" })} // Set selected year
                                    >
                                        ALL
                                    </DropdownMenu.Item>
                                    {data?.departments
                                        ?.sort((a, b) => a.departmentname.localeCompare(b.departmentname)) // Sorting alphabetically by department name
                                        .map((dep) => (
                                            <DropdownMenu.Item
                                                key={dep.id}
                                                className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                                                onSelect={() => handleSelect("department", { id: dep.id, departmentname: dep.departmentname })} // Pass entire department object
                                            >
                                                {dep.departmentname}
                                            </DropdownMenu.Item>
                                        ))}

                                </DropdownMenu.Content>
                            }
                        </DropdownMenu.Root>

                    </div>
                    {/* Sub department dropdown */}
                    <div className="w-58 flex flex-col gap-1">
                        <label htmlFor="sub-department-dropdown" className="text-sm font-medium text-gray-700">
                            Select Sub Department :
                        </label>
                        <DropdownMenu.Root >
                            <DropdownMenu.Trigger asChild>
                                <button className="cursor-pointer !w-[352px] py-1 border-2 border-green-700 rounded-lg text-left text-gray-500 text-md pl-2 font-normal flex justify-between items-center">
                                    <span >{filters.subdepartmentName}</span>
                                    <RiArrowDropDownLine size={30} />
                                </button>
                            </DropdownMenu.Trigger>
                            {/* drop down only when user role is 1 that means when the user is admin */}
                            {
                                userData.data?.user.role != 3 &&
                                <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-1 !w-[356px]">
                                        <DropdownMenu.Item
                                            // key={dep.id}
                                            className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                                            onSelect={() => handleSelect("subdepartment", { id: 0, departmentname:"ALL" })} // Pass entire department object
                                        >
                                            ALL
                                        </DropdownMenu.Item>
                                    {subdepartmentData?.subdepartments.sort((a, b) => a.name.localeCompare(b.name))
                                        .map((dep) => (
                                            <DropdownMenu.Item
                                                key={dep.id}
                                                className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                                                onSelect={() => handleSelect("subdepartment", { id: dep.id, departmentname: dep.name })} // Pass entire department object
                                            >
                                                {dep.name}
                                            </DropdownMenu.Item>
                                        ))}

                                </DropdownMenu.Content>
                            }
                        </DropdownMenu.Root>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HomeFilterForm;

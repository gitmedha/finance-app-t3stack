import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { RiArrowDropDownLine } from "react-icons/ri";
import type { StaffFilterFormProps } from "./staff";
import { api } from '~/trpc/react';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Department, level, status (Active or Inactive)  
const StaffFilterForm: React.FC<StaffFilterFormProps> = ({ filters, handleSelect }) => {
  const userData = useSession()
  // Fetch data with pagination
  // const { data: designations, refetch: designationsFetch } = api.get.getDesignation.useQuery();
  // Fetch levels data
  const { data: staffLevels, refetch: staffLevelsFetch } = api.get.getStaffLevels.useQuery();
 
  // get head departments 
  const {data,refetch} = api.get.getHeadDepartments.useQuery()
  // get subdepartments of that department if not every sub department
  const {data:subDeptsData,refetch:subDeptRefetch} = api.get.getSubDepartments.useQuery(userData.data?.user.departmentId?{
    deptId: userData.data.user.departmentId
  }:{
    deptId:Number(filters.department)
  },{
    enabled:userData.data?.user.role !=3
  })
  
  // Filter out inactive departments and subdepartments
  const departmentDataFiltered = data?.filter(dept => dept.isactive !== false) ?? [];
  const subDeptsDataFiltered = subDeptsData?.filter(subDept => subDept.isactive !== false) ?? [];

  // No longer filtering departments by TBH prefix
  const departmentDataTBHFiltered = departmentDataFiltered;
  
  
  useEffect(() => {
    if (userData.data?.user.departmentId && userData.data?.user.departmentName)
      handleSelect("department", { value: userData.data?.user.departmentId, label: userData.data?.user.departmentName })
    if (userData.data?.user.subDepartmentId && userData.data?.user.subDepartmentName)
      handleSelect("subdepartment", { value: userData.data?.user.subDepartmentId, label: userData.data?.user.subDepartmentName })
  }, [userData])
  // Trigger refetch on page or limit change
  useEffect(() => {
    // void designationsFetch();
    void staffLevelsFetch();
    void refetch();
  }, [refetch, staffLevelsFetch]);
  useEffect(()=>{
    void subDeptRefetch()
  },[subDeptRefetch,filters.department])
 
  return (
    <div className='w-full flex flex-col gap-1 md:flex-row'>

      {/* department dropdown */}
      <div className='w-full md:w-40 flex flex-col gap-1'>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button color="gray" className='cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
              <span>
                {filters.departmentname || 'Select Department'}
              </span>

              <RiArrowDropDownLine size={30} />
            </button>
          </DropdownMenu.Trigger>
          {
            userData.data?.user.role == 1 && 
            <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[180px]">
              <DropdownMenu.Item
                className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                onSelect={() => handleSelect('department', { departmentname: '' })}
              >
                All
              </DropdownMenu.Item>
              {departmentDataFiltered?.map((dep) => (
                <DropdownMenu.Item
                  key={dep?.value}
                  className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                  onSelect={() => handleSelect('department', { value: Number(dep.value), label: dep.label })}
                >
                  {dep.label}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          }
          
        </DropdownMenu.Root>
      </div>

      {/* sub departments here */}
      <div className='w-full md:w-52 flex flex-col gap-1'>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button color="gray" className='cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
              <span>
                {filters.subdepartmentname || 'Select Sub Dept'}
              </span>

              <RiArrowDropDownLine size={30} />
            </button>
          </DropdownMenu.Trigger>
          {
            (userData.data?.user.role == 2 || userData.data?.user.role == 1) && <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[180px]">
               <DropdownMenu.Item
                  className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                  onSelect={() => handleSelect('subdepartment', { subdepartmentname: '' })}
                >
                  All
                </DropdownMenu.Item>
              
              {subDeptsDataFiltered?.map((dep) => (
                <DropdownMenu.Item
                  key={dep?.value}
                  className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                  onSelect={() => handleSelect('subdepartment', { value: Number(dep.value), label: dep.label })}
                >
                  {dep.label}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          }
          
        </DropdownMenu.Root>
      </div>

      {/* Level dropdown */}
      <div className='w-full md:w-52 flex flex-col gap-1'>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button color="gray" className='cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
              <span>
                {staffLevels?.levels.find((l: { value: number | null; label: string }) => l.value === filters.level)?.label ?? 'Select Level'}
              </span>

              <RiArrowDropDownLine size={30} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[180px]">
            <DropdownMenu.Item
              className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
              onSelect={() => handleSelect('level', { value: 0 })}
            >
              All
            </DropdownMenu.Item>
            {staffLevels?.levels.map((level: { value: number | null, label: string }) => (
              <DropdownMenu.Item
                key={level.value?.toString() ? level.value?.toString() : 'null-key'}
                className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                onSelect={() => handleSelect('level', level)}
              >
                {level.label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
{/* status dropdown */}
      <div className='w-full md:w-52 flex flex-col gap-1'>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="w-full" asChild>
            <button color='gray' className='cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center '>
              <span>
                {filters.status || 'Select Status'}
              </span>

              <RiArrowDropDownLine size={30} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[180px]">
            {[{ value: '' },{ value: 'Active' }, { value: 'Inactive' }].map((status) => (
              <DropdownMenu.Item
                key={status.value}
                className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                onSelect={() => handleSelect('status', status)}
              >
                {status.value || 'All'}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      {/* 🔹 NEW: ALL / Not Hired dropdown */}
      <div className='w-full md:w-32 flex flex-col gap-1'>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className='cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center'>
              <span>{filters.hiredStatus === "not-hired" ? "TBH" :  "All"}</span>
              <RiArrowDropDownLine size={30} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[140px]">
            {[
              { label: "ALL", value: "" },
              { label: "TBH", value: "not-hired" },
            ].map(opt => (
              <DropdownMenu.Item
                key={opt.label}
                className="p-2 focus:ring-0 hover:bg-gray-100 rounded cursor-pointer"
                onSelect={() => handleSelect('hiredStatus', opt)} // 🔹 uses your existing handler
              >
                {opt.label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>
  );
};

export default StaffFilterForm;

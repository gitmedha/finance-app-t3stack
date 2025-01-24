import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { RiArrowDropDownLine } from "react-icons/ri";
import { useEffect } from 'react';
import type { BudgetFilterFormProps } from "./budget";
import { Button } from '@radix-ui/themes';
import { api } from "~/trpc/react";
import { useSession } from 'next-auth/react';
const BudgetFilterForm: React.FC<BudgetFilterFormProps> = ({ filters, handleSelect,budgetId,setBugetId,status,setStatus }) => {
  const userData = useSession()
  // Fetch data for departments
  const { data, refetch } = api.get.getDepartments.useQuery(
    { page: 1, limit: 100, type: 'Department' },
    { enabled: userData.data?.user.role == 1 }
  );
  // Define years from 2023-24 to 2029-30
  const years = [
    "2029-30","2023-24", "2024-25", "2025-26", "2026-27",
    "2027-28", "2028-29"
  ];
  const updateBudgetStatus = api.post.updateStatusBudgetDetails.useMutation()
  useEffect(() => {
    if (data && data.departments.length === 0) {
      void refetch(); // Trigger refetch if departments are empty
    }
  }, [data, refetch]);
  const handelStatusUpdate = (status:string)=>{
    try{
      if(budgetId)
      {
        updateBudgetStatus.mutate({
          budgetId,
          status
        },{
          // need to update the status from here
          onSuccess: (data) => {
            setStatus(status)
            console.log("Budget created successfully:", data);
          },
          onError: (error) => {
            console.error("Error creating budget:", error);
          },
        })
      }

    }catch(error){
      console.error("Failed to save budget details:", error);
      alert("Failed to save budget details. Please try again.");
    }
  }
  useEffect(()=>{
    if (userData.data?.user.departmentId && userData.data?.user.departmentName )
      handleSelect("department", { id: userData.data?.user.departmentId, departmentname: userData.data?.user.departmentName })
    if (years[0])
      handleSelect("year", years[0])
  },[userData])
  
  useEffect(() => {
    if (data?.departments?.length) {
      const sortedDepartments = [...data.departments].sort((a, b) =>
        a.departmentname.localeCompare(b.departmentname)
      );
      if (sortedDepartments[0] && years[0]) {
        handleSelect("department", { id: sortedDepartments[0].id, departmentname: sortedDepartments[0].departmentname })
        handleSelect("year", years[0])
      }

    }
  }, [data]);

  // creating the budget
  const createBudgetMutation = api.post.createBudget.useMutation();
  const handelCreateBudget = () => {
    if (!filters.year || !filters.department) {
      console.error("Year and department are required to create a budget.");
      return;
    }
    const input = {
      financialYear: filters.year,
      createdBy: 1,
      departmentId: parseInt(filters.department),
      createdAt: "2022-11-20",
    };
    createBudgetMutation.mutate(input, {
      onSuccess: (data) => {
        console.log("Budget created successfully:", data);
        setBugetId(data[0]? data[0].id : null)
      },
      onError: (error) => {
        console.error("Error creating budget:", error);
      },
    });
  };

  return (
    <div className='flex justify-between'>
      <div className="flex justify-start items-center space-x-2">
        <div className="w-52">
          {/* Department Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center">
                <span>{filters.departmentname} {filters.department}</span>
                <RiArrowDropDownLine size={30} />
              </button>
            </DropdownMenu.Trigger>
            {/* drop down only when user role is 1 that means when the user is admin */}
            {
              userData.data?.user.role == 1 && <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-[220px]">
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

        <div className="w-52">
          {/* Year Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center">
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
      </div>
      <div className='flex justify-end items-center space-x-2'>
        {
          !budgetId && <Button
            type="button"
            className="!cursor-pointer !text-white !bg-primary px-2"
            variant="soft"
            onClick={handelCreateBudget}
          >
            Create Budget
          </Button>
        }
        {
          budgetId && <div className='flex justify-end items-center space-x-2'>
            {
              userData.data?.user.role != 1 && status == "draft" &&<Button
                type="button"
                className="!cursor-pointer !text-white !bg-primary px-2"
                variant="soft"
                onClick={() => handelStatusUpdate("submitted")}
              >
                Submit
              </Button>
            }
            {
              userData.data?.user.role == 1 && status == "submitted" && <Button
                type="button"
                className="!cursor-pointer !text-white !bg-primary px-2"
                variant="soft"
                onClick={() => handelStatusUpdate("approved")}
              >
                Approve
              </Button>
            }
          </div>
        }
        
      </div>
    </div>
  );
};

export default BudgetFilterForm;

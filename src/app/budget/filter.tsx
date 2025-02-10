import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { RiArrowDropDownLine } from "react-icons/ri";
import { useEffect, useState } from 'react';
import type { BudgetFilterFormProps } from "./budget";
import { Button, Flex } from '@radix-ui/themes';
import { api } from "~/trpc/react";
import { useSession } from 'next-auth/react';
import Modal from '../_components/Modal';
import { toast } from 'react-toastify';
const BudgetFilterForm: React.FC<BudgetFilterFormProps> = ({ filters, handleSelect, budgetId, setBugetId, status, setStatus }) => {
  const userData = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Fetch data for departments
  const { data} = api.get.getDepartments.useQuery(
    { page: 1, limit: 100, type: 'Department' },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 0, }
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
  const updateBudgetStatus = api.post.updateStatusBudgetDetails.useMutation()

  const handelStatusUpdate = (status: string,userId:number) => {
    try {
      if (budgetId) {
        updateBudgetStatus.mutate({
          budgetId,
          status,
          userId
        }, {
          // need to update the status from here
          onSuccess: (data) => {
            setIsModalOpen(false)
            setStatus(status)
            toast.success(`Successfully budget ${status}`, {
              position: "bottom-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            console.log("Budget status updated successfully:", data);
          },
          onError: (error) => {
            throw new Error(JSON.stringify(error))
            console.error("Error creating budget:", error);
          },
        })
      }

    } catch (error) {
      console.error("Failed to save budget details:", error);
      toast.warn(`Error while ${status == "submitted" ? "submitting" : "approving"} the budget `, {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }
  useEffect(() => {
    if (userData.data?.user.departmentId && userData.data?.user.departmentName)
      handleSelect("department", { id: userData.data?.user.departmentId, departmentname: userData.data?.user.departmentName })
    if (userData.data?.user.subDepartmentId && userData.data?.user.subDepartmentName)
      handleSelect("subdepartment", { id: userData.data?.user.subDepartmentId, departmentname: userData.data?.user.subDepartmentName })
  }, [userData])

  useEffect(() => {
    if (!userData.data?.user.departmentId && !userData.data?.user.departmentName)
    {
      if (data?.departments?.length) {
        const sortedDepartments = [...data.departments].sort((a, b) =>
          a.departmentname.localeCompare(b.departmentname)
        );
        if (sortedDepartments[0]) {
          handleSelect("department", { id: sortedDepartments[0].id, departmentname: sortedDepartments[0].departmentname })
        }
      }
    }

  }, [data]);
  
  useEffect(()=>{
    if (!userData.data?.user.subDepartmentId && !userData.data?.user.subDepartmentName) {
      if (subdepartmentData?.subdepartments?.length) {
        const sortedDepartments = [...subdepartmentData.subdepartments].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        if (sortedDepartments[0]) {
          handleSelect("subdepartment", { id: sortedDepartments[0].id, departmentname: sortedDepartments[0].name })
        }
      }
    }
  }, [subdepartmentData])

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
        setBugetId(data[0] ? data[0].id : null)
      },
      onError: (error) => {
        console.error("Error creating budget:", error);
      },
    });
  };

  return (
    <div>
      <div className='flex justify-between'>
        <div className="flex justify-start items-center space-x-4">

          {/* Year Dropdown */}
          <div className="w-52">
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
          {/* Department */}
          <div className="w-52">
            {/* Department Dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center">
                  <span>{filters.departmentname}</span>
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
          {/* Sub department dropdown */}
          <div className="w-58">
          <DropdownMenu.Root >
            <DropdownMenu.Trigger asChild className='!w-full'>
              <button className="cursor-pointer w-full py-1 border rounded-lg text-left text-gray-500 text-sm pl-2 font-normal flex justify-between items-center">
                <span>{filters.subdepartmentName}</span>
                <RiArrowDropDownLine size={30} />
              </button>
            </DropdownMenu.Trigger>
            {/* drop down only when user role is 1 that means when the user is admin */}
            {
              userData.data?.user.role != 3 && 
              <DropdownMenu.Content className="bg-white max-h-56 overflow-y-scroll shadow-lg rounded-lg p-2 !w-fit">
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
        <div className='flex justify-end items-center space-x-2'>
          {
            !budgetId && userData.data?.user.role == 2 &&<Button
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
                userData.data?.user.role == 2 && status == "draft" && <Button
                  type="button"
                  className="!cursor-pointer !text-white !bg-primary px-2"
                  variant="soft"
                  onClick={() =>
                    setIsModalOpen(true) 
                  }
                >
                  Submit
                </Button>
              }
              {
                userData.data?.user.role == 1 && status == "submitted" && <Button
                  type="button"
                  className="!cursor-pointer !text-white !bg-primary px-2"
                  variant="soft"
                  onClick={() => 
                    setIsModalOpen(true) 
                  }
                >
                  Approve
                </Button>
              }
            </div>
          }

        </div>
      </div>
      <div className='text-right p-2 text-green-900 font-black'>
          {
          status == "submitted" && <p>{status.toUpperCase()}</p>
          }
        {
          status == "draft" && userData.data?.user.role == 1 && <p className='text-red-900'>{status.toUpperCase()}</p>
        }
        {
          status == "approved" && <p>{status.toUpperCase()}</p>
        }
      </div>

      <Modal
        title={`Status ${userData.data?.user.role == 2 ? "Submit" : "Approve"} confirmation`}
        className=""
        description=""
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}>
          <div>
            <p>Are sure you want to {userData.data?.user.role == 2 ? "Submit" : "Approve" } this budget</p>
          <Flex gap="3" mt="4" justify="end">
            <Button
              onClick={() => setIsModalOpen(false)}
              type="button"
              className="!cursor-pointer"
              variant="soft"
              color="gray"
            >
              Cancel
            </Button>
            {
              userData.data?.user.role == 2 ?  <Button
                type="submit"
                className="!cursor-pointer !bg-primary text-white"
                onClick={() => handelStatusUpdate("submitted",userData.data?.user.id ?? 1)}
              >
                Submit
              </Button> : <Button
                type="submit"
                className="!cursor-pointer !bg-primary text-white"
                  onClick={() => handelStatusUpdate("approved", userData.data?.user.id ?? 1)}
              >
                Approve
              </Button>
            }
            
          </Flex>
          </div>
      </Modal>
    </div>
  );
};

export default BudgetFilterForm;

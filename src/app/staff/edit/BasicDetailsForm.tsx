import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { Button, Flex } from "@radix-ui/themes";
import { api } from "~/trpc/react";
import Select from "react-select";
import { type StaffItem } from "../staff";
import useStaff from "../store/staffStore";
import {toast} from "react-toastify"
import { TRPCClientError } from "@trpc/client";
import { type ISelectItem } from "~/app/common/types/genericField";

interface ItemDetailProps {
  item: StaffItem;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetchStaffs: () => void;
}

interface typeMappingSchema {
  value: string
  label: string
}
const typeMapping: typeMappingSchema[] = [
  { label: "Full Time Consultant", value: "FTC" },
  { label: "Full Time Employee", value: "FTE" },
  { label: "On Contract", value: "CON" },
  { label: "Full Time Consultant (M.Corp)", value: "FTCM" },
  { label: "Part time Consultant", value: "PTC" }
]
const BasicDetails: React.FC<ItemDetailProps> = ({
  item,
  setIsModalOpen,
  refetchStaffs,
}) => {
  const userData = useSession();
  const apiContext = api.useContext();
  const { setActiveStaffId } = useStaff();
  
  // Add state for hired checkbox
  const [isHired, setIsHired] = useState(item.hired === "true" || item.hired === "hired");
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<StaffItem>({
    defaultValues: item,
  });



  const stateName = watch("statesData")?.label ?? "";
  const departmentId = watch("departmentData")?.value

  const { mutate: editStaff } = api.post.editStaff.useMutation({
      
    async onSuccess(data) {
      await apiContext.get.getStaffs.invalidate();
      if (data.staff) {
        setActiveStaffId(data.staff?.id);
      }
      refetchStaffs();
    },
    onError(err) {
      console.log(err.message, "err.message");
      console.error("Error adding staff:", err);
    },
  });
  const { data: departmentData } = api.get.getAllDepartments.useQuery();
  const { data: statesData } = api.get.getAllStates.useQuery();
  const { data: locationsData = [], refetch } =
    api.get.getAllLocations.useQuery({
      stateName,
    });
  const { data: levelsData = [] } = api.get.getLevels.useQuery()
  const { data: subDepartsmentData = [], refetch:subDepartmentsRefectch } =
    api.get.getSubDepartments.useQuery({
      deptId: Number(departmentId)
    },{
      enabled:!!departmentId
    });

  // Filter out inactive departments and subdepartments
  const departmentDataFiltered = departmentData?.filter(dept => (dept as ISelectItem & { isactive?: boolean }).isactive !== false) ?? [];
  const subDepartsmentDataFiltered = subDepartsmentData.filter(subDept => (subDept as ISelectItem & { isactive?: boolean }).isactive !== false);

  const onSubmit: SubmitHandler<StaffItem> = async (data) => {
    try {
      console.log(data, "Edit data");
             const submissionData = {
         id: data.id,
         name: data.name,
         empNo: data.empNo,
         designation: data?.designation,
         natureOfEmployment: data?.typeData?.value?.toString() ?? undefined,
         project: data.project ?? undefined,
         department: Number(data?.departmentData?.value),
         stateId: data?.statesData?.label ? data?.statesData?.label?.toString() : undefined,
         locationId: data?.locationData?.label ? data?.locationData?.label?.toString() : undefined,
         level: Number(data.levelData?.value),
         subDeptid: data.subDeptData?.value ? Number(data.subDeptData.value) : null,
         email: data.email,
         dateOfJoining: data.dateOfJoining,
         hired: isHired ? "true" : "false",
         updatedBy: userData.data?.user.id ?? 1,
         isactive: true,
         updatedAt: new Date().toISOString().split("T")[0] ?? "",
       };
console.log(submissionData, "submissionData");
      editStaff(submissionData);
      reset(submissionData);
      toast.success('Successfully Edited', {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      // reset();
      // await apiContext.get.getStaffs.invalidate();
      // setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding staff:", error);
      let errorMessage = "Something went wrong. Please try again.";

      if (error instanceof TRPCClientError) {
        errorMessage = error.message; 
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    if (stateName) {
      void refetch();
    }
  }, [refetch, stateName]);
  useEffect(()=>{
    if(departmentId)
    {
      void subDepartmentsRefectch()
    }
  }, [subDepartmentsRefectch, departmentId])

  // Reset form when item changes to ensure proper pre-population
  useEffect(() => {
    if (item) {
      reset(item);
    }
  }, [item, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-2">
        {/* Name Field */}
        <div className="w-1/2">
          <div>
            <label className="text-sm">Name</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              placeholder="Enter staff name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <span className="text-xs text-red-500">{errors.name.message}</span>
            )}
          </div>
        </div>

        {/* Employee Number Field */}
        <div className="w-1/2">
          <div>
            <label className="text-sm">Employee Number</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              placeholder="Enter employee number"
              {...register("empNo", {
                required: "Employee number is required",
              })}
            />
            {errors.empNo && (
              <span className="text-xs text-red-500">{errors.empNo.message}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {/* State Dropdown */}
        <div className="w-1/2">
          <div>
            <label className="text-sm">State</label>
            <Controller
              name="statesData"
              control={control}
              render={({ field }) => (
                <Select
                  onChange={field.onChange}
                  defaultValue={item.statesData?.value ? item.statesData : undefined}
                  options={statesData}
                  placeholder="Select a state"
                  isClearable
                  aria-invalid={!!errors.state}
                />
              )}
            />

            {errors.state && (
              <span className="text-xs text-red-500">{errors.state.message}</span>
            )}
          </div>
        </div>
        {/* Location Dropdown */}
        <div className="w-1/2">
          <div>
            <label className="text-sm">Location</label>
            <Controller
              name="locationData"
              control={control}
              render={({ field }) => (
                <Select
                  onChange={field.onChange}
                  defaultValue={item?.locationData?.value ? item.locationData : undefined}
                  options={locationsData}
                  placeholder="Select a location"
                  isClearable
                  aria-invalid={!!errors.location}
                />
              )}
            />
            {errors.location && (
              <span className="text-xs text-red-500">
                {errors.location.message}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Email and Date of Joining */}
      <div className="flex gap-2">
        <div className="w-1/2">
          <label className="text-sm">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
            placeholder="Enter staff email"
            defaultValue={item.email ?? ''}
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email.message}</span>
          )}
        </div>
        <div className="w-1/2">
          <label className="text-sm">
            Date of Joining <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
            defaultValue={item.dateOfJoining ? new Date(item.dateOfJoining).toISOString().split('T')[0] : ''}
            {...register("dateOfJoining", { required: "Date of joining is required" })}
          />
          {errors.dateOfJoining && (
            <span className="text-xs text-red-500">{errors.dateOfJoining.message}</span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <div className="w-1/2">
          {/* Designation Field */}
          <div>
            <label className="text-sm">Designation</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              placeholder="Enter designation"
              {...register("designation", {
                required: "Designation is required",
              })}
            />
            {errors.designation && (
              <span className="text-xs text-red-500">
                {errors.designation.message}
              </span>
            )}
          </div>
        </div>

        <div className="w-1/2">
          <label className="text-sm">Emp Type</label>
          <Controller
            name="typeData"
            control={control}
            render={({ field }) => (
              <Select
                onChange={field.onChange}
                defaultValue={typeMapping.find((map) => map.value == item.nature_of_employment)}
                options={typeMapping}
                placeholder="Enter employment type"
                isClearable
                aria-invalid={!!errors.typeData}
              />
            )}
          />
          {errors.typeData && (
            <span className="text-xs text-red-500">
              {errors.typeData.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <div className="w-1/2">
          {/* Project Field */}
          <div>
            <label className="text-sm">Project</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              placeholder="Enter project name"
              {...register("project")}
            />
            {errors.project && (
              <span className="text-xs text-red-500">
                {errors.project.message}
              </span>
            )}
          </div>
        </div>
        
        <div className="w-1/2">
          <label className="text-sm">Department</label>
          <Controller
            name="departmentData"
            control={control}
            render={({ field }) => (
              <Select
                onChange={field.onChange}
                defaultValue={item.departmentData}
                options={departmentDataFiltered}
                placeholder="Select a Department"
                isClearable
                aria-invalid={!!errors.department}
              />
            )}
          />
          {errors.department && (
            <span className="text-xs text-red-500">
              {errors.department.message}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex gap-2">
        {/* Level Dropdown */}
        <div className="w-1/2">
          <label className="text-sm">
            Level <span className="text-red-400">*</span>
          </label>
          <Controller
            name="levelData"
            control={control}
            render={({ field }) => (
              <Select
                onChange={field.onChange}
                defaultValue={item.levelData}
                options={levelsData}
                placeholder="Select Level"
                isClearable
                aria-invalid={!!errors.levelData}
              />
            )}
          />
          {errors.levelData && (
            <span className="text-xs text-red-500">
              {errors.levelData.message}
            </span>
          )}
        </div>
        
        {/* Sub department */}
        <div className="w-1/2">
          <label className="text-sm">
            Sub Department <span className="text-red-400">*</span>
          </label>
          <Controller
            name="subDeptData"
            control={control}
            rules={{
              validate: (value) => {
                const selectedDeptId = Number(departmentId);
                const hideSubDeptForDepts = [4, 5, 6, 7, 8];
                const shouldDisableSubDept = hideSubDeptForDepts.includes(selectedDeptId);
                
                if (!shouldDisableSubDept && (!value ? true : !value.value)) {
                  return "Sub Department is required";
                }
                return true;
              }
            }}
            render={({ field }) => {
              const selectedDeptId = Number(departmentId);
              const hideSubDeptForDepts = [4, 5, 6, 7, 8];
              const shouldDisableSubDept = hideSubDeptForDepts.includes(selectedDeptId);
              
              return (
                <Select
                  onChange={field.onChange}
                  defaultValue={item.subDeptData}
                  options={subDepartsmentDataFiltered}
                  placeholder="Select a Sub Department"
                  isClearable
                  isDisabled={shouldDisableSubDept}
                  aria-invalid={!!errors.subDeptData}
                />
              );
            }}
          />
          {errors.subDeptData && (
            <span className="text-xs text-red-500">
              {errors.subDeptData.message}
            </span>
          )}
        </div>
      </div>

      {/* Hired Checkbox */}
      <div className="flex gap-2">
        <div className="w-1/2">
          <label className="text-sm">
            Hired Status
          </label>
          <div className="mt-1 flex items-center gap-2 p-3 border rounded-lg bg-white">
            <input
              type="checkbox"
              id="hired-checkbox"
              checked={isHired}
              onChange={(e) => setIsHired(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="hired-checkbox" className="text-sm font-medium cursor-pointer">
              {isHired ? "Hired" : "Hired"}
            </label>
          </div>
        </div>
        <div className="w-1/2">
          {/* Empty div for spacing to match other fields */}
        </div>
      </div>

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
        <Button
          type="submit"
          className="!cursor-pointer !bg-primary text-white"
        >
          Save
        </Button>
      </Flex>
    </form>
  );
};

export default BasicDetails;

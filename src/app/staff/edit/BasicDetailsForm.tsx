import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { Button, Flex } from "@radix-ui/themes";
import { api } from "~/trpc/react";
import Select from "react-select";
import { type StaffItem } from "../staff";
import useStaff from "../store/staffStore";
import {toast} from "react-toastify"
import { TRPCClientError } from "@trpc/client";

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

  const onSubmit: SubmitHandler<StaffItem> = async (data) => {
    try {
      const submissionData = {
        id: data.id,
        name: data.name,
        empNo: data.empNo,
        designation: data.designation,
        natureOfEmployment: data.typeData?.value.toString(),
        department: Number(data.departmentData?.value),
        stateId: data.statesData?.label.toString(),
        locationId: data.locationData?.label.toString(),
        updatedBy: userData.data?.user.id ?? 1,
        isactive: true,
        level: Number(data.levelData?.value),
        subDeptid:Number(data.subDeptData?.value),
        updatedAt: new Date().toISOString().split("T")[0] ?? "",
      };

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
            disabled
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
                  defaultValue={item.statesData}
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
                  defaultValue={item.locationData}
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
          <label className="text-sm">Department</label>
          <Controller
            name="departmentData"
            control={control}
            render={({ field }) => (
              <Select
                onChange={field.onChange}
                defaultValue={item.departmentData}
                options={departmentData}
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
      </div>
      
      <div>
        {/* Sub department */}
        <div className="w-1/2">
          <label className="text-sm">Sub Department</label>
          <Controller
            name="subDeptData"
            control={control}
            render={({ field }) => (
              <Select
                onChange={field.onChange}
                defaultValue={item.subDeptData}
                options={subDepartsmentData}
                placeholder="Select a Sub Department"
                isClearable
                aria-invalid={!!errors.subDepartment}
              />
            )}
          />
          {errors.subDepartment && (
            <span className="text-xs text-red-500">
              {errors.subDepartment.message}
            </span>
          )}
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

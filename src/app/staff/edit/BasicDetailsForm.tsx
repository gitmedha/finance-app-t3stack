import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { Button, Flex } from "@radix-ui/themes";
import { api } from "~/trpc/react";
import Select from "react-select";
import { type StaffItem } from "../staff";
import useStaff from "../store/staffStore";

interface ItemDetailProps {
  item: StaffItem;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetchStaffs: () => void;
}

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

  const onSubmit: SubmitHandler<StaffItem> = async (data) => {
    try {
      const submissionData = {
        id: data.id,
        name: data.name,
        empNo: data.empNo,
        designation: data.designation,
        nature_of_employment: data.nature_of_employment,
        department: data.departmentData?.value,
        stateId: data.statesData?.value.toString(),
        locationId: data.locationData?.value.toString(),
        updatedBy: userData.data?.user.id ?? 1,
        isactive: true,
        updatedAt: new Date().toISOString().split("T")[0] ?? "",
      };

      editStaff(submissionData);
      reset(submissionData);
      // reset();
      // await apiContext.get.getStaffs.invalidate();
      // setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  useEffect(() => {
    if (stateName) {
      void refetch();
    }
  }, [refetch, stateName]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Name Field */}
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

      {/* Employee Number Field */}
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

      {/* State Dropdown */}
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

      {/* Location Dropdown */}
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

      <div>
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

      {/* Emp Type */}
      <div>
        <label className="text-sm">Emp Type</label>
        <input
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
          placeholder="Enter employment type"
          {...register("nature_of_employment")}
        />
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

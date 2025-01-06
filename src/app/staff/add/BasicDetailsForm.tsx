import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { Button, Flex } from "@radix-ui/themes";
import { api } from "~/trpc/react";
import Select from "react-select";
import { type ISelectItem } from "../../common/types/genericField";
import useStaff from "../store/staffStore";

interface ItemDetailProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetchStaffs: () => void;
}

interface StaffFormData {
  name: string;
  empNo: string;
  stateData: ISelectItem;
  locationData: ISelectItem;
  departmenData: ISelectItem;
  designation: string;
  isactive: boolean;
  natureOfEmployment: string;
  createdBy: number;
  createdAt: string; // Date in ISO format
}

const BasicDetails: React.FC<ItemDetailProps> = ({
  setIsModalOpen,
  refetchStaffs,
}) => {
  const userData = useSession();
  const apiContext = api.useContext();
  const { setActiveStaffId, activeStaffDetails, setActiveStaffDetails } = useStaff();
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StaffFormData>({
    defaultValues: activeStaffDetails,
  });
  const stateName = watch("stateData");

  // const addStaffMutation = api.post.addStaff.useMutation();

  const { mutate: addStaff } = api.post.addStaff.useMutation({
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
      stateName: stateName?.label,
    });

  const onSubmit: SubmitHandler<StaffFormData> = async (data) => {
    try {
      const submissionData = {
        ...data,
        createdBy: userData.data?.user.id ?? 1,
        isactive: true,
        createdAt: new Date().toISOString().split("T")[0] ?? "",
        stateId: Number(data.stateData.value),
        locationId: Number(data.locationData.value),
        departmentId: Number(data.departmenData.value),
      };
      setActiveStaffDetails(submissionData);
      addStaff(submissionData);
      // reset(submissionData);
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  useEffect(() => {
    void refetch();
  }, [refetch, stateName]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Name Field */}
      <div>
        <label className="text-sm">
          Name <span className="text-red-400">*</span>
        </label>
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
        <label className="text-sm">
          Employee Number <span className="text-red-400">*</span>
        </label>
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
        <label className="text-sm">
          State <span className="text-red-400">*</span>
        </label>
        <Controller
          name="stateData"
          control={control}
          render={({ field }) => (
            <Select
              onChange={field.onChange}
              options={statesData}
              placeholder="Select a state"
              isClearable
              aria-invalid={!!errors.stateData}
            />
          )}
        />

        {errors.stateData && (
          <span className="text-xs text-red-500">{errors.stateData.message}</span>
        )}
      </div>

      {/* Location Dropdown */}
      <div>
        <label className="text-sm">
          Location <span className="text-red-400">*</span>
        </label>
        <Controller
          name="locationData"
          control={control}
          render={({ field }) => (
            <Select
              onChange={field.onChange}
              options={locationsData}
              placeholder="Select a location"
              isClearable
              aria-invalid={!!errors.locationData}
            />
          )}
        />
        {errors.locationData && (
          <span className="text-xs text-red-500">
            {errors.locationData.message}
          </span>
        )}
      </div>

      {/* Designation Field */}
      <div>
        <label className="text-sm">
          Designation <span className="text-red-400">*</span>
        </label>
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
        <label className="text-sm">
          Department <span className="text-red-400">*</span>
        </label>
        <Controller
          name="departmenData"
          control={control}
          render={({ field }) => (
            <Select
              onChange={field.onChange}
              options={departmentData}
              placeholder="Select a Department"
              isClearable
              aria-invalid={!!errors.departmenData}
            />
          )}
        />
        {errors.departmenData && (
          <span className="text-xs text-red-500">
            {errors.departmenData.message}
          </span>
        )}
      </div>

      {/* Emp Type */}
      <div>
        <label className="text-sm">Emp Type</label>
        <input
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
          placeholder="Enter employment type"
          {...register("natureOfEmployment")}
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

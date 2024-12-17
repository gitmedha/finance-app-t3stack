// pages/ProfileEditPage.tsx

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { IconButton, Button, Flex } from "@radix-ui/themes";
import Modal from "../_components/Modal";
import { MdEdit } from "react-icons/md";
import { api } from "~/trpc/react";
import Select from "react-select";
import { type StaffItem } from "./staff";

interface ItemDetailProps {
  item: StaffItem;
}

const EditStaff: React.FC<ItemDetailProps> = ({ item }) => {
  const userData = useSession();
  const apiContext = api.useContext();
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
    async onSuccess() {
      await apiContext.get.getStaffs.invalidate();
      reset();
      setIsModalOpen(false);
    },
    onError(err) {
      console.error("Error adding staff:", err);
    },
  });
	const { data: departmentData } = api.get.getAllDepartments.useQuery();
  const { data: statesData } = api.get.getAllStates.useQuery();
  const { data: locationsData = [], refetch } =
    api.get.getAllLocations.useQuery({
			stateName
		});

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSubmit: SubmitHandler<StaffItem> = async (data) => {
    try {
      const submissionData = {
				id: data.id,
				name: data.name,
				empNo: data.empNo,
				designation: data.designation,
				nature_of_employment: data.nature_of_employment,
				department: data.departmentData?.value,
				stateId: data.statesData?.value,
				locationId: data.locationData?.value,
				updatedBy: userData.data?.user.id ?? 1,
				isactive: true,
				updatedAt: new Date().toISOString().split("T")[0] ?? "",
      };

      editStaff(submissionData);
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
    <>
      <IconButton
        className="!h-7 !w-7 !cursor-pointer !bg-primary"
        onClick={() => setIsModalOpen(true)}
      >
        <MdEdit size={20} />
      </IconButton>

      <Modal
        title="Edit Staff"
        description="Make changes to your profile."
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <div>
            <label className="text-sm">
              Name
            </label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              placeholder="Enter staff name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <span className="text-xs text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Employee Number Field */}
          <div>
            <label className="text-sm">
              Employee Number
            </label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              placeholder="Enter employee number"
              {...register("empNo", {
                required: "Employee number is required",
              })}
            />
            {errors.empNo && (
              <span className="text-xs text-red-500">
                {errors.empNo.message}
              </span>
            )}
          </div>

          {/* State Dropdown */}
          <div>
            <label className="text-sm">
              State
            </label>
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
              <span className="text-xs text-red-500">
                {errors.state.message}
              </span>
            )}
          </div>

          {/* Location Dropdown */}
          <div>
            <label className="text-sm">
              Location
            </label>
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
            <label className="text-sm">
              Designation
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
              Department
            </label>
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
            <Button type="submit" className="!cursor-pointer">
              Save
            </Button>
          </Flex>
        </form>
      </Modal>
    </>
  );
};

export default EditStaff;

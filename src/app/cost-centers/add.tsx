"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { IconButton, Button, Flex } from "@radix-ui/themes";
import Modal from "../_components/Modal";
import { BiPlus } from "react-icons/bi";
import { api } from "~/trpc/react";
import Select from "react-select";

interface SelectItemDto {
  value: string;
  label: string;
}
interface CostCenterFormData {
  name: string;
  parentId: number;
  type: SelectItemDto;
  code: string;
}

interface AddCostCenterProps {
  refetch: () => void;
}

const AddCostCenter: React.FC<AddCostCenterProps> = ({ refetch }) => {
  const userData = useSession();

  const types = [
    { value: "Sub Department", label: "Sub Department" },
    { value: "Cluster", label: "Cluster" },
    { value: "Department", label: "Department" },
  ];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CostCenterFormData>({
    defaultValues: {},
  });

  const addCostCenterMutation = api.post.addCostCenter.useMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSubmit: SubmitHandler<CostCenterFormData> = async (data) => {
    try {
      const submissionData = {
        ...data,
        parentId: Number(data.parentId),
        type: data.type.value,
        createdBy: userData.data?.user.id ?? 1,
        isactive: true,
        createdAt: new Date().toISOString().split("T")[0] ?? "",
      };
      await addCostCenterMutation.mutateAsync(submissionData);
      refetch()
      reset();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  //   Options for react-select
  //   const stateOptions = statesData?.map(
  //     (state: { id: number; name: string }) => ({
  //       value: state.id,
  //       label: state.name,
  //     }),
  //   );

  return (
    <>
      <IconButton
        className="!h-8 !w-8 !cursor-pointer !bg-primary"
        onClick={() => setIsModalOpen(true)}
      >
        <BiPlus size={20} />
      </IconButton>

      <Modal
        title="Add Cost Center"
        description=""
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <div>
            <label className="text-sm">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              placeholder="Enter CostCenter name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <span className="text-xs text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Parent Id Field */}
          <div>
            <label className="text-sm">
              Parent Id <span className="text-red-400">*</span>
            </label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              placeholder="Enter Parent Id"
              type="number"
              {...register("parentId", {
                required: "Parent Id is required",
              })}
            />
            {errors.parentId && (
              <span className="text-xs text-red-500">
                {errors.parentId.message}
              </span>
            )}
          </div>

          {/* Types Dropdown */}
          <div>
            <label className="text-sm">
              Types <span className="text-red-400">*</span>
            </label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  onChange={field.onChange}
                  options={types}
                  placeholder="Select a Type"
                  isClearable
                  aria-invalid={!!errors.type}
                />
              )}
            />

            {errors.type && (
              <span className="text-xs text-red-500">
                {errors.type.message}
              </span>
            )}
          </div>

          <div>
            <label className="text-sm">
              Code <span className="text-red-400">*</span>
            </label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              placeholder="Enter Code"
              {...register("code", { required: "Description is required" })}
            />
            {errors.code && (
              <span className="text-xs text-red-500">
                {errors.code.message}
              </span>
            )}
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

export default AddCostCenter;

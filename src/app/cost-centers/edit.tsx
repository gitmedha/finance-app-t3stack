// pages/ProfileEditPage.tsx

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { IconButton, Button, Flex } from "@radix-ui/themes";
import Modal from "../_components/Modal";
import { MdEdit } from "react-icons/md";
import { api } from "~/trpc/react";
import Select from "react-select";
import { type costCenters } from "./cost-center";

interface ItemDetailProps {
  item: costCenters;
  refetch: () => void;
}

const EditCostCenters: React.FC<ItemDetailProps> = ({ item, refetch }) => {
  const userData = useSession();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<costCenters>({
    defaultValues: item,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const types = [
    { value: "Sub Department", label: "Sub Department" },
    { value: "Cluster", label: "Cluster" },
    { value: "Department", label: "Department" },
  ];

  const handleSave = () => {
    setIsModalOpen(false);
  };

  const { mutate: editCostCenter } = api.post.editCostCenter.useMutation({
    async onSuccess() {
      refetch();
      reset();
      setIsModalOpen(false);
    },
    onError(err) {
      console.error("Error adding staff:", err);
    },
  });

  const onSubmit: SubmitHandler<costCenters> = async (data) => {
    try {
      const submissionData = {
        id: data.id,
        name: data.name,
        parentId: Number(data.parentId),
        type: data.typeData.value ?? item.typeData.value,
        updatedBy: userData.data?.user.id ?? 1,
        updatedAt: new Date().toISOString().split("T")[0] ?? "",
      };
      editCostCenter(submissionData);
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  return (
    <>
      <IconButton
        className="!h-7 !w-7 !cursor-pointer !bg-primary"
        onClick={() => setIsModalOpen(true)}
      >
        <MdEdit size={20} />
      </IconButton>

      <Modal
        title="Edit Cost Center"
        description="Make changes to Cost Center."
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <div>
            <label className="text-sm">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              placeholder="Enter Cost Center name"
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
              Parent Id<span className="text-red-400">*</span>
            </label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              placeholder="Enter Code"
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
              name="typeData"
              control={control}
              render={({ field }) => (
                <Select
                  onChange={field.onChange}
                  defaultValue={item.typeData}
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
              {...register("code", { required: "Code is required" })}
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

export default EditCostCenters;

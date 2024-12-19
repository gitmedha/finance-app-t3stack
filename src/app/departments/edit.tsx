// pages/ProfileEditPage.tsx

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { IconButton, Button, Flex } from "@radix-ui/themes";
import Modal from "../_components/Modal";
import { MdEdit } from "react-icons/md";
import { api } from "~/trpc/react";
import Select from "react-select";
import { type Department } from "./department";

interface ItemDetailProps {
  item: Department;
  refetch: () => void;
}

const EditDepartments: React.FC<ItemDetailProps> = ({ item, refetch }) => {
  const apiContext = api.useContext();
  const userData = useSession();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Department>({
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

  const { mutate: editDepartment } = api.post.editDepartment.useMutation({
      async onSuccess() {
        refetch()
        reset();
        setIsModalOpen(false);
      },
      onError(err) {
        console.error("Error adding staff:", err);
      },
    });

  const onSubmit: SubmitHandler<Department> = async (data) => {
      try {
        const submissionData = {
          id: data.id,
          departmentname: data.departmentname,
          deptCode: Number(data.deptCode),
          type: data.typeData.value ?? item.typeData.value,
          updatedBy: userData.data?.user.id ?? 1,
          isactive: true,
          updatedAt: new Date().toISOString().split("T")[0] ?? "",
        };
        editDepartment(submissionData);
        await apiContext.get.getAllDepartments.invalidate();
        reset();
        setIsModalOpen(false);
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
        title="Add Departments"
        description="Make changes to your profile."
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
              placeholder="Enter department name"
              {...register("departmentname", { required: "Name is required" })}
            />
            {errors.departmentname && (
              <span className="text-xs text-red-500">
                {errors.departmentname.message}
              </span>
            )}
          </div>

          {/* Code Field */}
          <div>
            <label className="text-sm">
              Department Code <span className="text-red-400">*</span>
            </label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              placeholder="Enter Code"
              type="number"
              {...register("deptCode", {
                required: "Department Code is required",
              })}
            />
            {errors.deptCode && (
              <span className="text-xs text-red-500">
                {errors.deptCode.message}
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

export default EditDepartments;

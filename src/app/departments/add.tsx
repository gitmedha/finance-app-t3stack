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
interface SelectParentDepartment{
  value:number|null,
  label:string|undefined
}
interface DepartmentFormData {
  departmentname: string;
  deptCode: number;
  type: SelectItemDto;
  departmentData: SelectParentDepartment

}

interface AddDepartmentProps {
  refetch: () => void;
}

const AddDepartment: React.FC<AddDepartmentProps> = ({ refetch }) => {
  const userData = useSession();

  const types = [
    { value: "Sub Department", label: "Sub Department" },
    { value: "Department", label: "Department" },
  ];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<DepartmentFormData>({
    defaultValues: {},
  });

  const addDepartmentMutation = api.post.addDepartment.useMutation();
  const { data: departmentData } = api.get.getHeadDepartments.useQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSubmit: SubmitHandler<DepartmentFormData> = async (data) => {
    try {
      const submissionData = {
        ...data,
        deptCode: Number(data.deptCode),
        type: data.type.value,
        createdBy: userData.data?.user.id ?? 1,
        parentId: data.departmentData?.value ?? null,
        isactive: true,
        createdAt: new Date().toISOString().split("T")[0] ?? "",
      };
      await addDepartmentMutation.mutateAsync(submissionData);
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
  const selectedTypeData = watch("type");
  return (
    <>
      <IconButton
        className="!h-8 !w-8 !cursor-pointer !bg-primary"
        onClick={() => setIsModalOpen(true)}
      >
        <BiPlus size={20} />
      </IconButton>

      <Modal
        className=''
        title="Add Department"
        description=""
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="">
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
          <div className={` ${selectedTypeData && selectedTypeData.value != "Sub Department" ? "" : "pb-6"}`}>
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

            {/* Departments drop down */}
          {selectedTypeData && selectedTypeData.value == "Sub Department" && <div className={`${isDropdownOpen ? "pb-36" : ""}`}>
            <label className="text-sm">
              Department <span className="text-red-400">*</span>
            </label>
            <Controller
              name="departmentData"
              control={control}
              render={({ field }) => (
                <Select
                  onChange={field.onChange}
                  options={departmentData}
                  placeholder="Select a Department"
                  isClearable
                  aria-invalid={!!errors.departmentData}
                  onMenuOpen={() => setIsDropdownOpen(true)}
                  onMenuClose={() => { setIsDropdownOpen(false) }}
                />
              )}
            />

            {errors.departmentData && (
              <span className="text-xs text-red-500">
                {errors.departmentData.message}
              </span>
            )}
          </div>}
            
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
            <Button type="submit" className="!cursor-pointer !bg-primary text-white">
              Save
            </Button>
          </Flex>
        </form>
      </Modal>
    </>
  );
};

export default AddDepartment;

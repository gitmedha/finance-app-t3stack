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
  const [typeData, setTypeData] = useState<null|{ label: string, value: string }>(null)
  const onSubmit: SubmitHandler<DepartmentFormData> = async (data) => {
    try {
      if (data.type.value == "Sub Department" && !data.departmentData.value)
        throw new Error("Sub department needs to have the parent department")
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
  // const selectedTypeData = watch("type");
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
          <div className="flex gap-2">
            {/* Name Field */}
            <div className="w-1/2">
              <label className="text-sm ">
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
            <div className="w-1/2">
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
          </div>
          
          <div className="flex gap-2">
            <div className={` ${typeData && typeData.value != "Sub Department" ? " " : "pb-6 w-1/2"} w-1/2`}>
              <label className="text-sm">
                Types <span className="text-red-400">*</span>
              </label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption); // Update React Hook Form state
                      setTypeData(selectedOption);
                    }}
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
            {typeData && typeData.value == "Sub Department" && <div className={`${isDropdownOpen ? "pb-52" : ""} w-1/2`}>
              <label className="text-sm">
                Parent Department <span className="text-red-400">*</span>
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
          </div>
          {/* Types Dropdown */}
          

            {/* Departments drop down */}
          
            
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

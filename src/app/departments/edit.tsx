// pages/ProfileEditPage.tsx

import React, { useEffect, useState } from "react";
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
    // setValue,
    formState: { errors },
    reset,
  } = useForm<Department>({
    defaultValues: item,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const types = [
    { value: "Sub Department", label: "Sub Department" },
    { value: "Department", label: "Department" },
  ];
  useEffect(() => {
      reset(item); 
  }, [item,reset]);
  const [typeData, setTypeData] = useState<null|{ label: string, value: string }>(item.typeData)
  
  const handleSave = () => {
    setIsModalOpen(false);
  };
  const { data: departmentData } = api.get.getHeadDepartments.useQuery();
  const { mutate: editDepartment } = api.post.editDepartment.useMutation({
    async onSuccess() {
      refetch();
      reset();
      setIsModalOpen(false);
    },
    onError(err) {
      console.error("Error adding staff:", err);
    },
  });
  // const selectedTypeData = watch("typeData");
  const onSubmit: SubmitHandler<Department> = async (data) => {
    try {
      if (data.typeData.value == "Sub Department" && !data.departmentData.value )
        throw new Error("Sub department needs to have the parent department")
      const submissionData = {
        id: data.id,
        departmentname: data.departmentname,
        deptCode: Number(data.deptCode),
        type: data.typeData.value ?? item.typeData.value,
        departmentId:data.departmentData.value,
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
        className=""
        title="Edit Department"
        description="Make changes to existing department."
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      >
        <form onSubmit={handleSubmit(onSubmit)} >
          <div className="flex gap-2">
            {/* Name Field */}
            <div className="w-1/2">
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
            {/* Types Dropdown */}
            <div className={` ${typeData && typeData.value != "Sub Department" ? " " : "pb-6 w-1/2"} w-1/2`}>
              <label className="text-sm" >
                Types <span className="text-red-400">*</span>
              </label>
              <Controller
                name="typeData"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption); // Update React Hook Form state
                      setTypeData(selectedOption);
                    }}
                    defaultValue={item.typeData}
                    options={types}
                    placeholder="Select a Type"
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

            {/*Departments dropdown  */}
            {(typeData && typeData.value == "Sub Department") && <div className={`${isDropdownOpen ? "pb-52" : ""} w-1/2`}>
              <label className="text-sm">
                Parent Department <span className="text-red-400">*</span>
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
      </Modal>
    </>
  );
};

export default EditDepartments;

"use client";

import React, { useEffect, useState } from "react";
import { useForm, type SubmitHandler, Controller, useWatch } from "react-hook-form";
import { IconButton, Button, Flex } from "@radix-ui/themes";
import Modal from "../_components/Modal";
import { BiPlus } from "react-icons/bi";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { TRPCClientError } from "@trpc/client";
import Select, { StylesConfig } from "react-select";
import { api } from "~/trpc/react";
import type { FormData } from "./program-activity";

// Custom portal styles for React-Select menus
const selectStyles: StylesConfig = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const AddName: React.FC<{ refetch: () => void }> = ({ refetch }) => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // User details from session
  const userRole = session?.user?.role ?? 1;
  const userDeptId = session?.user?.departmentId;
  const userDeptName = session?.user?.departmentName;
  const userSubDeptId = session?.user?.subDepartmentId;
  const userSubDeptName = session?.user?.subDepartmentName;

  const isRestrictedUser = userRole === 2 || userRole === 3;
  const isSubDeptHead = userRole === 3;

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: { name: "", department: null, subDepartment: null, financialYear: null },
  });

  const selectedDept = useWatch({ name: "department", control });

  const { data: deptOptions = [] } = api.get.getHeadDepartments.useQuery();
  const { data: subDeptOptions = [], refetch: refetchSub } =
    api.get.getSubDepartments.useQuery(
      { deptId: selectedDept?.value ?? userDeptId ?? 0 },
      { enabled: !!selectedDept || !!userDeptId }
    );

  const activeDeptOptions = deptOptions.filter((dept) => dept.isactive);
  const activeSubDeptOptions = subDeptOptions.filter((sub) => sub.isactive);

  const thisYear = new Date().getFullYear();
  const fyOptions = Array.from({ length: 10 }).map((_, i) => {
    const start = thisYear - i;
    const end = start + 1;
    return { value: `${start}-${String(end).slice(-2)}`, label: `${start}-${String(end).slice(-2)}` };
  });

  const addActivity = api.post.addProgramActivities.useMutation();

  useEffect(() => {
    if (isRestrictedUser && isModalOpen) {
      if (userDeptId && userDeptName) {
        setValue("department", { value: userDeptId, label: userDeptName });
      }
      if (userSubDeptId && userSubDeptName) {
        setValue("subDepartment", { value: userSubDeptId, label: userSubDeptName });
      }
    }
  }, [isRestrictedUser, isModalOpen, userDeptId, userDeptName, userSubDeptId, userSubDeptName, setValue]);

  useEffect(() => {
    if (selectedDept) void refetchSub();
  }, [selectedDept, refetchSub]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (!data.department) throw new Error("Please select a department");
      if (!data.financialYear) throw new Error("Please select a financial year");

      const payload = {
        name: data.name.trim(),
        description: null,
        departmentId: data.department.value,
        subDepartmentId: data.subDepartment?.value ?? null,
        financialYear: data.financialYear.value,
        isActive: true,
        createdBy: session?.user.id ?? 1,
        createdAt: new Date().toISOString().split("T")[0] ?? new Date().toISOString(),
      };

      await addActivity.mutateAsync(payload);
      toast.success("Program activity added successfully", { position: "bottom-left", autoClose: 1000 });
      reset();
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      let msg = "Something went wrong.";
      if (err instanceof TRPCClientError) msg = err.message;
      else if (err instanceof Error) msg = err.message;
      toast.error(msg, { position: "bottom-left", autoClose: 3000 });
    }
  };

  const handleClose = () => {
    reset();
    setIsModalOpen(false);
  };

  return (
    <>
      <IconButton className="!h-8 !w-8 !bg-primary !cursor-pointer" onClick={() => setIsModalOpen(true)}>
        <BiPlus size={20} />
      </IconButton>

      {/* Ensure modal itself can show portaled dropdowns */}
      <Modal title="Add Program Activity" description="" isOpen={isModalOpen} onClose={handleClose} className="h-[450px] overflow-y-auto overflow-visible">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name <span className="text-red-400">*</span></label>
            <input type="text" placeholder="Enter name" className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm outline-none" autoComplete="off" {...register("name", { required: "Name is required" })} />
            {errors.name?.message && <span className="text-xs text-red-500">{errors.name.message}</span>}
          </div>

          {/* Department & Sub-Department */}
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Department <span className="text-red-400">*</span></label>
              {isRestrictedUser ? (
                <div className="mt-1 block w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm">{userDeptName ?? "Not assigned"}</div>
              ) : (
                <Controller
                  control={control}
                  name="department"
                  rules={{ required: "Department is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={activeDeptOptions}
                      placeholder="Select Dept"
                      isClearable
                      styles={selectStyles}               
                      aria-invalid={!!errors.department}
                    />
                  )}
                />
              )}
              {errors.department?.message && <span className="text-xs text-red-500">{errors.department.message}</span>}
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Sub Department</label>
              {isSubDeptHead ? (
                <div className="mt-1 block w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm">{userSubDeptName ?? "Not assigned"}</div>
              ) : (
                <Controller
                  control={control}
                  name="subDepartment"
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={activeSubDeptOptions}
                      placeholder="Select Sub-Dept"
                      isClearable
                      isDisabled={isRestrictedUser && !selectedDept}
                      styles={selectStyles}
                    />
                  )}
                />
              )}
            </div>
          </div>

          {/* Financial Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Financial Year <span className="text-red-400">*</span></label>
            <Controller
              control={control}
              name="financialYear"
              rules={{ required: "Year is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={fyOptions}
                  placeholder="Select FY"
                  isClearable
                  styles={selectStyles}
                />
              )}
            />
            {errors.financialYear?.message && <span className="text-xs text-red-500">{errors.financialYear.message}</span>}
          </div>

          {/* Footer */}
          <Flex justify="end" gap="3" mt="4">
            <Button type="button" variant="soft" color="gray" onClick={handleClose} className="!cursor-pointer">Cancel</Button>
            <Button type="submit" className="!bg-primary text-white !cursor-pointer" disabled={isSubmitting}>Save</Button>
          </Flex>
        </form>
      </Modal>
    </>
  );
};

export default AddName;

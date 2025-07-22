"use client";

import React, { useState, useEffect } from "react";
import { IconButton, Flex, Button } from "@radix-ui/themes";
import Modal from "../_components/Modal";
import { MdEdit } from "react-icons/md";
import Select from "react-select";
import { useSession } from "next-auth/react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { TRPCClientError } from "@trpc/client";
import { toast } from "react-toastify";
import { api } from "~/trpc/react";
import type { EditProgramActivityProps, FormValues } from "./program-activity";

const toastConfig = {
  position: "bottom-left" as const,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  theme: "light" as const,
};

export default function EditProgramActivity({
  item,
  refetch,
}: EditProgramActivityProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  // User role locks fields
  const role = session?.user.role ?? 1;
  const disableDept = role === 2 || role === 3;
  const disableSub = role === 3;

  // Form setup
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: item.name,
      description: item.description ?? "",
      department: item.departmentData?.value
        ? { value: item.departmentData.value, label: item.departmentData.label }
        : null,
      subDepartment: item.subDepartmentData?.value
        ? {
            value: item.subDepartmentData.value,
            label: item.subDepartmentData.label,
          }
        : null,
      financialYear: item.financialYear,
    },
  });

  // Dropdown options
  const { data: depts = [] } = api.get.getHeadDepartments.useQuery();
  const selectedDept = useWatch({ control, name: "department" });
  const { data: subs = [], refetch: reloadSubs } =
    api.get.getSubDepartments.useQuery(
      { deptId: selectedDept?.value ?? item.departmentData?.value ?? 0 },
      { enabled: Boolean(selectedDept) },
    );

  const activeDepts = depts
    .filter((d) => d.isactive)
    .map((d) => ({ value: d.value, label: d.label }));
  console.log(activeDepts, "activeDepts");
  const activeSubs = subs
    .filter((s) => s.isactive)
    .map((s) => ({ value: s.value, label: s.label }));

  // Fiscal year options
  const currentYear = new Date().getFullYear();
  const fyOptions = Array.from({ length: 10 }, (_, i) => {
    const start = currentYear - i;
    const end = start + 1;
    const label = `${start}-${String(end).slice(-2)}`;
    return { value: label, label };
  });

  // Update activity
  const { mutate: updateActivity } = api.post.updateProgramActivity.useMutation(
    {
      onSuccess: () => {
        refetch();
        setIsOpen(false);
        toast.success("Successfully updated", {
          ...toastConfig,
          autoClose: 1000,
        });
      },
      onError: (err) => {
        const msg =
          err instanceof TRPCClientError ? err.message : "Update failed";
        toast.error(msg, { ...toastConfig, autoClose: 3000 });
      },
    },
  );

  // Reload sub-departments when dept changes
  useEffect(() => {
    if (selectedDept) {
      void reloadSubs();
    }
  }, [selectedDept, reloadSubs]);

  // Reset form each time modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        name: item.name,
        description: item.description ?? "",
        department: item.departmentData,
        subDepartment: item.subDepartmentData,
        financialYear: item.financialYear,
      });
    }
  }, [isOpen, item, reset]);

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    if (!data.department) {
      toast.error("Please select a department", toastConfig);
      return;
    }

    updateActivity({
      id: item.id,
      name: data.name,
      description: data.description,
      departmentId: data.department.value,
      subDepartmentId: data.subDepartment?.value ?? null,
      financialYear: data.financialYear,
      isActive: true,
      updatedBy: session?.user.id ?? 1,
      updatedAt: new Date().toISOString().split("T")[0] ?? "",
    });
  };
  return (
    <>
      <IconButton
        onClick={() => setIsOpen(true)}
        className="!h-7 !w-7 !cursor-pointer !bg-primary"
      >
        <MdEdit size={20} />
      </IconButton>

      <Modal
        className="max-w-2xl"
        title="Edit Program Activity"
        description="Update the details below"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSubmit(onSubmit)}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm">
                Department <span className="text-red-400">*</span>
              </label>
              <Controller
                name="department"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={activeDepts.map((dept) => ({
                      value: dept.value,
                      label: dept.label,
                    }))}
                    isClearable={!disableDept}
                    isDisabled={disableDept}
                    placeholder="Select Department"
                  />
                )}
              />
            </div>

            <div className="flex-1">
              <label className="text-sm">Sub Department</label>
              <Controller
                name="subDepartment"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={activeSubs.map((sub) => ({
                      value: sub.value,
                      label: sub.label,
                    }))}
                    isClearable={!disableSub}
                    isDisabled={disableSub || !selectedDept}
                    placeholder="Select Sub Department"
                  />
                )}
              />
            </div>
          </div>

          <div>
            <label className="text-sm">
              Financial Year <span className="text-red-400">*</span>
            </label>
            <Controller
              name="financialYear"
              control={control}
              rules={{ required: "FY is required" }}
              render={({ field: { onChange, value, ...rest } }) => (
                <Select<{ value: string; label: string }>
                  {...rest}
                  options={fyOptions}
                  isClearable
                  placeholder="Select FY"
                  value={
                    fyOptions.find((option) => option.value === value) ?? null
                  }
                  onChange={(opt) => onChange(opt?.value ?? "")}
                />
              )}
            />
            {errors.financialYear && (
              <p className="text-xs text-red-500">
                {errors.financialYear.message}
              </p>
            )}
          </div>

          <Flex justify="end" gap="3" className="mt-4">
            <Button
              variant="soft"
              color="gray"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" className="!bg-primary text-white">
              Save
            </Button>
          </Flex>
        </form>
      </Modal>
    </>
  );
}

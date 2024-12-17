// pages/ProfileEditPage.tsx
"use client";

import React, { useState } from "react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { IconButton, Button, Flex } from "@radix-ui/themes";
import Modal from "../_components/Modal";
import { BiPlus } from "react-icons/bi";
import { api } from "~/trpc/react";
import Select from "react-select";
import { type ISelectItem } from "../common/types/genericField";
import { useSession } from "next-auth/react";

interface DonorFormData {
  name: string;
  costCenter?: ISelectItem;
  finYear: number;
  totalBudget: string;
  budgetReceived: string;
  currency: string;
  isactive: boolean;
  createdBy: number;
  type?: string;
  createdAt: string; // Remove `undefined`
}

const AddDonors: React.FC = () => {
  const userData = useSession();
  const donorMutation = api.post.addDonor.useMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: costCentersData } = api.get.getAllCostCenters.useQuery();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DonorFormData>({
    defaultValues: {
      isactive: true,
      createdAt: new Date().toISOString().split("T")[0], // Default to today's date (YYYY-MM-DD)
    },
  });

  const onSubmit: SubmitHandler<DonorFormData> = async (data) => {
    try {
      const submissionData = {
        ...data,
        createdBy: userData.data?.user.id ?? 1,
        costCenter: Number(data?.costCenter?.value),
        totalBudget: data?.totalBudget,
        budgetReceived: data?.budgetReceived,
        finYear: Number(data?.finYear),
        createdAt: data.createdAt || new Date().toISOString(), // Ensure `createdAt` is always a string
      };
      await donorMutation.mutateAsync(submissionData);
      reset();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding donor:", error);
    }
  };

  // Options for react-select
//   const costCentersOptions = costCentersData?.costCenters?.map(
//     (costCenter: any) => ({
//       value: costCenter?.id,
//       label: costCenter?.name,
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
        className=''
        title="Add Donor"
        description=""
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              placeholder="Enter donor name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <span className="text-xs text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Cost Center Dropdown */}
          <div>
            <label className="text-sm">
              Cost Center <span className="text-red-400">*</span>
            </label>
            <Controller
              name="costCenter"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={costCentersData}
                  placeholder="Select a cost center"
                  isClearable
                  aria-invalid={!!errors.costCenter}
                />
              )}
            />

            {errors.costCenter && (
              <span className="text-xs text-red-500">
                {errors.costCenter.message}
              </span>
            )}
          </div>

          <div>
            <label className="text-sm">
              Financial Year <span className="text-red-400">*</span>
            </label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              placeholder="Enter financial year"
              type="number"
              {...register("finYear", {
                required: "Financial year is required",
                min: { value: 2000, message: "Year must be 2000 or later" },
                max: { value: 2100, message: "Year must be 2100 or earlier" },
              })}
            />
            {errors.finYear && (
              <span className="text-xs text-red-500">
                {errors.finYear.message}
              </span>
            )}
          </div>

          <div>
            <label className="text-sm">
              Total Budget <span className="text-red-400">*</span>
            </label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              placeholder="Enter total budget"
              type="number"
              {...register("totalBudget", {
                required: "Total budget is required",
                min: { value: 0, message: "Budget must be greater than 0" },
              })}
            />
            {errors.totalBudget && (
              <span className="text-xs text-red-500">
                {errors.totalBudget.message}
              </span>
            )}
          </div>

          <div>
            <label className="text-sm">
              Budget Received <span className="text-red-400">*</span>
            </label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              placeholder="Enter budget received"
              type="number"
              {...register("budgetReceived", {
                required: "Budget received is required",
                min: { value: 0, message: "Budget must be greater than 0" },
              })}
            />
            {errors.budgetReceived && (
              <span className="text-xs text-red-500">
                {errors.budgetReceived.message}
              </span>
            )}
          </div>

          <div>
            <label className="text-sm">
              Currency <span className="text-red-400">*</span>
            </label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              placeholder="Enter currency"
              {...register("currency", { required: "Currency is required" })}
            />
            {errors.currency && (
              <span className="text-xs text-red-500">
                {errors.currency.message}
              </span>
            )}
          </div>

          <div>
            <label className="text-sm">
              Type <span className="text-red-400">*</span>
            </label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              placeholder="Enter donor type"
              {...register("type")}
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
            <Button type="submit" className="!cursor-pointer !bg-primary text-white">
              Save
            </Button>
          </Flex>
        </form>
      </Modal>
    </>
  );
};

export default AddDonors;

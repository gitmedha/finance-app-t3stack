// components/SalaryDetailsForm.tsx
import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { type StaffItem } from "../staff";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";

interface SalaryDetailsFormProps {
  item: StaffItem;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
}

const SalaryDetailsForm: React.FC<SalaryDetailsFormProps> = ({
  item,
  setIsModalOpen,
  refetch,
}) => {
  const userData = useSession();
  const { register, handleSubmit, reset } = useForm<StaffItem>({
    defaultValues: item, // Pre-populate the form fields with item data
  });

  const { mutate: editSalaryDetails } =
    api.post.editStaffSalaryDetails.useMutation({
      async onSuccess() {
        refetch();
      },
      onError(err) {
        console.error("Error adding staff:", err);
      },
    });

  const { mutate: createSalaryDetails } =
    api.post.addStaffSalaryDetails.useMutation({
      async onSuccess() {
        refetch();
      },
      onError(err) {
        console.error("Error adding staff:", err);
      },
    });

  const onSubmit: SubmitHandler<StaffItem> = (data) => {
    try {
      if (item.salaryDetailsId) {
        const submissionData = {
          ...data,
          id: data.salaryDetailsId ?? 0,
          salary: data.salary,
          empId: data.id,
          insurance: data.insurance,
          bonus: data.bonus,
          gratuity: data.gratuity,
          epf: data.epf,
          pgwPld: data.pgwPld,
          updatedBy: userData.data?.user.id ?? 1,
          isactive: true,
          updatedAt: new Date().toISOString().split("T")[0] ?? "",
        };

        editSalaryDetails(submissionData);
      } else {
        const submissionData = {
          ...data,
          salary: data.salary,
          empId: data.id,
          insurance: data.insurance,
          bonus: data.bonus,
          gratuity: data.gratuity,
          epf: data.epf,
          pgwPld: data.pgwPld,
          createdBy: userData.data?.user.id ?? 1,
          isactive: true,
          createdAt: new Date().toISOString().split("T")[0] ?? "",
        };

        createSalaryDetails(submissionData);
      }

      // reset();
      // await apiContext.get.getStaffs.invalidate();
      // setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
      {/* Salary Field */}
      <div>
        <label className="text-sm">Salary</label>
        <input
          type="number"
          placeholder="Enter salary"
          {...register("salary", { required: "Salary is required" })}
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
        />
        {/* {errors.salary && <span className="text-xs text-red-500">{errors.salary.message}</span>} */}
      </div>

      {/* Insurance */}
      <div>
        <label className="text-sm">Insurance</label>
        <input
          type="number"
          placeholder="Enter insurance amount"
          {...register("insurance")}
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
        />
      </div>

      {/* Bonus */}
      <div>
        <label className="text-sm">Bonus</label>
        <input
          type="number"
          placeholder="Enter bonus amount"
          {...register("bonus")}
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
        />
      </div>

      {/* Gratuity */}
      <div>
        <label className="text-sm">Gratuity</label>
        <input
          type="number"
          placeholder="Enter gratuity amount"
          {...register("gratuity")}
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
        />
      </div>

      {/* EPF */}
      <div>
        <label className="text-sm">EPF</label>
        <input
          type="number"
          placeholder="Enter EPF amount"
          {...register("epf")}
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
        />
      </div>

      <div>
        <label className="text-sm">PGW PLD</label>
        <input
          type="number"
          placeholder="Enter PGW PLD amount"
          {...register("pgwPld")}
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
        />
      </div>

      {/* Submit and Cancel Buttons */}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          onClick={() => setIsModalOpen(false)}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="hover:bg-primary-dark rounded-lg bg-primary px-4 py-2 text-sm text-white"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default SalaryDetailsForm;

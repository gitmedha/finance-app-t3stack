// components/SalaryDetailsForm.tsx
import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { type StaffItem } from "../staff";

interface SalaryDetailsFormProps {
  item: StaffItem;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SalaryDetailsForm: React.FC<SalaryDetailsFormProps> = ({ item, setIsModalOpen }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<StaffItem>({
    defaultValues: item, // Pre-populate the form fields with item data
  });

  const onSubmit: SubmitHandler<StaffItem> = (data) => {
    console.log("Form submitted data:", data);
    // Perform any API calls or actions needed here
    setIsModalOpen(false); // Close modal after submitting
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Salary Field */}
      <div>
        <label className="text-sm">Salary</label>
        <input
          type="number"
          placeholder="Enter salary"
        //   {...register("salary", { required: "Salary is required" })}
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
        //   {...register("insurance")}
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
        />
      </div>

      {/* Bonus */}
      <div>
        <label className="text-sm">Bonus</label>
        <input
          type="number"
          placeholder="Enter bonus amount"
        //   {...register("bonus")}
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
        />
      </div>

      {/* Gratuity */}
      <div>
        <label className="text-sm">Gratuity</label>
        <input
          type="number"
          placeholder="Enter gratuity amount"
        //   {...register("gratuity")}
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
        />
      </div>

      {/* EPF */}
      <div>
        <label className="text-sm">EPF</label>
        <input
          type="number"
          placeholder="Enter EPF amount"
        //   {...register("epf")}
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
          className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary-dark"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default SalaryDetailsForm;

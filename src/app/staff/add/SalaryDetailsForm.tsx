// components/SalaryDetailsForm.tsx
import React, { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { type StaffItem } from "../staff";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import useStaff from "../store/staffStore";
import { toast } from "react-toastify"

interface SalaryDetailsFormProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
}

const SalaryDetailsForm: React.FC<SalaryDetailsFormProps> = ({
  setIsModalOpen,
  refetch
}) => {
  const { activeStaffId, activeStaffDetails } = useStaff();
  const userData = useSession();
  
  // Check if staff name starts with "tbh" (case-insensitive)
  const isTbhStaff = activeStaffDetails.name?.toLowerCase().startsWith('tbh') ?? false;
  
  // State for hired checkbox (only relevant for TBH staff)
  const [isHired, setIsHired] = useState(activeStaffDetails.hired ?? true);
  
  // Form is editable if: not TBH staff OR (TBH staff AND hired checkbox is checked)
  const isFormEditable = !isTbhStaff || (isTbhStaff && isHired);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm<StaffItem>({
    defaultValues: {}, // Pre-populate the form fields with item data
  });

  // Watch the salary field for changes
  const salaryValue = watch("salary");

  // Auto-calculate bonus, gratuity, and EPF when salary changes
  useEffect(() => {
    if (salaryValue && !isNaN(Number(salaryValue))) {
      const salary = Number(salaryValue);
      
      // Calculate bonus: (salary * 12) * 0.06
      const bonus = (salary * 12) * 0.06;
      setValue("bonus", bonus.toString());
      
      // Calculate gratuity: (salary * 15) / 26
      const gratuity = (salary * 15) / 26;
      setValue("gratuity", gratuity.toString());
      
      // Calculate EPF: (salary * 0.4) * 0.125
      const epf = (salary * 0.4) * 0.125;
      setValue("epf", epf.toString());
    }
  }, [salaryValue, setValue]);

  const { mutate: createSalaryDetails } =
    api.post.addStaffSalaryDetails.useMutation({
      async onSuccess(data) {
        toast.success('Successfully Saved', {
          position: "bottom-left",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // await apiContext.get.getStaffs.invalidate();
        // if (data.staff) {
        //   setActiveStaffId(data.staff?.id);
        // }
        refetch();
      },
      onError(err) {
        toast.error(`Failed to Save ${err.message}`, {
          position: "bottom-left",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.error("Error adding staff:", err.message);
      },
    });

  const { mutate: editStaff } =
    api.post.editStaff.useMutation({
      async onSuccess(data) {
        // Staff hired status updated successfully
        console.log("Staff hired status updated:", data);
      },
      onError(err) {
        console.error("Error updating staff hired status:", err.message);
      },
    });

  const onSubmit: SubmitHandler<StaffItem> = (data) => {
    try {
      // Update staff hired status if it has changed for TBH staff
      if (isTbhStaff && activeStaffDetails.hired !== isHired) {
        const staffUpdateData = {
          id: activeStaffId ?? 0,
          hired: isHired,
          updatedBy: userData.data?.user.id ?? 1,
          updatedAt: new Date().toISOString().split("T")[0] ?? "",
        };
        editStaff(staffUpdateData);
      }

      const submissionData = {
        ...data,
        salary: data.salary,
        empId: activeStaffId ?? 0,
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

      // reset(submissionData);
      // await apiContext.get.getStaffs.invalidate();
      // setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
      {/* TBH Staff Hired Checkbox */}
      {isTbhStaff && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hired-checkbox"
              checked={isHired}
              onChange={(e) => setIsHired(e.target.checked)}
              className="mr-2 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="hired-checkbox" className="text-sm font-medium text-yellow-800">
              Hired
            </label>
          </div>
          <p className="text-xs text-yellow-700 mt-1">
            Check this box to enable editing salary details for TBH staff.
          </p>
        </div>
      )}
      
      {/* Salary Field */}
      <div>
        <label className="text-sm">Salary</label>
        <input
          type="number"
          placeholder="Enter salary"
          {...register("salary", { required: "Salary is required" })}
          className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none ${
            !isFormEditable ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          disabled={!isFormEditable}
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
          className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none ${
            !isFormEditable ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          disabled={!isFormEditable}
        />
      </div>

      {/* Bonus */}
      <div>
        <label className="text-sm">Bonus (Auto-calculated)</label>
        <input
          type="number"
          placeholder="Auto-calculated from salary"
          {...register("bonus")}
          className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none ${
            !isFormEditable ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'
          }`}
          readOnly
        />
      </div>

      {/* Gratuity */}
      <div>
        <label className="text-sm">Gratuity (Auto-calculated)</label>
        <input
          type="number"
          placeholder="Auto-calculated from salary"
          {...register("gratuity")}
          className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none ${
            !isFormEditable ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'
          }`}
          readOnly
        />
      </div>

      {/* EPF */}
      <div>
        <label className="text-sm">EPF (Auto-calculated)</label>
        <input
          type="number"
          placeholder="Auto-calculated from salary"
          {...register("epf")}
          className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none ${
            !isFormEditable ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'
          }`}
          readOnly
        />
      </div>

      <div>
        <label className="text-sm">PGW PLD</label>
        <input
          type="number"
          placeholder="Enter PGW PLD amount"
          {...register("pgwPld")}
          className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none ${
            !isFormEditable ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          disabled={!isFormEditable}
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
          className={`rounded-lg px-4 py-2 text-sm text-white ${
            isFormEditable 
              ? 'hover:bg-primary-dark bg-primary' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={!isFormEditable}
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default SalaryDetailsForm;

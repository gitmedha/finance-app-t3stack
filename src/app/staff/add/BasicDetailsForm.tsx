import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { Button, Flex } from "@radix-ui/themes";
import { api } from "~/trpc/react";
import Select from "react-select";
import {  type ISelectItem } from "../../common/types/genericField";
import useStaff from "../store/staffStore";
import { toast } from "react-toastify"
import { TRPCClientError } from "@trpc/client";

interface ItemDetailProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetchStaffs: () => void;
}

interface typeMappingSchema{
  value:string
  label:string
}

interface StaffFormData {
  name: string;
  email:string
  empNo: string;
  levelData:ISelectItem
  stateData: ISelectItem;
  locationData: ISelectItem;
  departmenData: ISelectItem;
  subDepartmentData:ISelectItem;
  designation: string;
  isactive: boolean;
  natureOfEmployment: ISelectItem;
  project: string;
  createdBy: number;
  createdAt: string; 
  dateOfJoining: string;
  dateOfResigning: string;
}

const typeMapping: typeMappingSchema []= [
  { label:"Full Time Consultant",value:"FTC"},
  { label:"Full Time Employee",value:"FTE"},
  { label:"On Contract",value:"CON"},
  { label:"Full Time Consultant (M.Corp)",value:"FTCM"},
  { label:"Part time Consultant",value:"PTC"}
]

const BasicDetails: React.FC<ItemDetailProps> = ({
  setIsModalOpen,
  refetchStaffs,
}) => {
  const userData = useSession();
  const apiContext = api.useContext();
  const { setActiveStaffId, activeStaffDetails, setActiveStaffDetails } = useStaff();
  
  // Add state for mode selection
  const [mode, setMode] = useState<'normal' | 'tbh'>('normal');
  
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StaffFormData>({
    defaultValues: activeStaffDetails,
  });
  
  const stateName = watch("stateData");
  const departmentId = watch("departmenData")

  const { mutate: addStaff } = api.post.addStaff.useMutation({
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
      await apiContext.get.getStaffs.invalidate();
      if (data.staff) {
        setActiveStaffId(data.staff?.id);
      }
      refetchStaffs();
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
      console.log(err,'staff err')
    },
  });

  // data
  const { data: departmentData } = api.get.getHeadDepartments.useQuery();
  const { data: statesData } = api.get.getAllStates.useQuery();
  const { data: locationsData = [], refetch } =api.get.getAllLocations.useQuery({stateName: stateName?.label,});
  const{data:levelsData=[]} = api.get.getLevels.useQuery()
  const { data: suDeptData = [], refetch: subDeptRefetch } = api.get.getSubDepartments.useQuery(departmentId?{ deptId: Number(departmentId?.value) }:{deptId:undefined})
  
  // Filter out inactive departments and subdepartments
  const departmentDataFiltered = departmentData?.filter(dept => dept.isactive !== false) ?? [];
  const suDeptDataFiltered = suDeptData.filter(subDept => subDept.isactive !== false);

  const onSubmit: SubmitHandler<StaffFormData> = async (data) => {
    try {
      // Validate sub-department requirement
      const selectedDeptId = Number(data.departmenData?.value);
      const hideSubDeptForDepts = [4, 5, 6, 7, 8];
      const shouldHideSubDept = hideSubDeptForDepts.includes(selectedDeptId);
      
      if (!shouldHideSubDept && !data.subDepartmentData?.value) {
        toast.error("Sub Department is required for this department", {
          position: "bottom-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      const submissionData = {
        ...data,
        // For TBH mode, set default values for required fields that are hidden
        empNo: mode === 'tbh' ? 'TBH' + Date.now() : data.empNo,
        email: mode === 'tbh' ? 'tbh'+Date.now()+'@company.com' : data.email,
        stateData: mode === 'tbh' ? { value: 'Default', label: 'Default' } : data.stateData,
        locationData: mode === 'tbh' ? { value: 'Default', label: 'Default' } : data.locationData,
        project: mode === 'tbh' ? 'TBH Project' : data.project,
        natureOfEmployment:data.natureOfEmployment.value.toString(),
        createdBy: userData.data?.user.id ?? 1,
        isactive: true,
        createdAt: new Date().toISOString().split("T")[0] ?? "",
        stateId: mode === 'tbh' ? 'Default' : data.stateData.label.toString(),
        locationId: mode === 'tbh' ? 'Default' : data.locationData.label.toString(),
        departmentId: Number(data.departmenData.value),
        level:Number(data.levelData.value),
        subDeptId: (() => {
          const selectedDeptId = Number(data.departmenData?.value);
          const hideSubDeptForDepts = [4, 5, 6, 7, 8];
          const shouldHideSubDept = hideSubDeptForDepts.includes(selectedDeptId);
          
          if (shouldHideSubDept) {
            return null;
          }
          
          return data.subDepartmentData?.value ? Number(data.subDepartmentData.value) : null;
        })(),
        dateOfJoining: data.dateOfJoining,
        dateOfResigning: null
      };
      console.log(submissionData, "submissionData");
      setActiveStaffDetails(submissionData);
      addStaff(submissionData);
      
      // // reset(submissionData);
    } catch (error) {
      console.error("Error adding staff:", error);
      let errorMessage = "Something went wrong. Please try again.";

      if (error instanceof TRPCClientError) {
        errorMessage = error.message; // Extract proper tRPC error message
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    void refetch();
  }, [refetch, stateName]);
  
  useEffect(() => {
    void subDeptRefetch();
  }, [subDeptRefetch, departmentId]);
  
  // Clear sub-department when department changes to one without sub-departments
  useEffect(() => {
    if (departmentId?.value) {
      const selectedDeptId = Number(departmentId.value);
      const hideSubDeptForDepts = [4, 5, 6, 7, 8];
      const shouldHideSubDept = hideSubDeptForDepts.includes(selectedDeptId);
      
      if (shouldHideSubDept) {
        setValue('subDepartmentData', { value: '', label: '' });
      }
    }
  }, [departmentId, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Mode Selection Radio Buttons */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-3 block">Staff Type <span className="text-red-400">*</span></label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="normal"
              checked={mode === 'normal'}
              onChange={(e) => setMode(e.target.value as 'normal' | 'tbh')}
              className="w-4 h-4 text-primary focus:ring-primary"
            />
            <span className="text-sm">Normal</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="tbh"
              checked={mode === 'tbh'}
              onChange={(e) => setMode(e.target.value as 'normal' | 'tbh')}
              className="w-4 h-4 text-primary focus:ring-primary"
            />
            <span className="text-sm">TBH</span>
          </label>
        </div>
      </div>

      {/* Always show these fields for both modes */}
      <div className="flex gap-2">
        <div className="w-1/2">
          <label className="text-sm">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
            placeholder="Enter staff name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <span className="text-xs text-red-500">{errors.name.message}</span>
          )}
        </div>
        {/* Level Dropdown - Always shown */}
        <div className="w-1/2">
          <label className="text-sm">
            Level <span className="text-red-400">*</span>
          </label>
          <Controller
            name="levelData"
            control={control}
            render={({ field }) => (
              <Select
                onChange={field.onChange}
                options={levelsData}
                placeholder="Select Level"
                isClearable
                aria-invalid={!!errors.levelData}
              />
            )}
          />
          {errors.levelData && (
            <span className="text-xs text-red-500">
              {errors.levelData.message}
            </span>
          )}
        </div>
      </div>

              {/* Department and Sub Department - Conditionally shown */}
      <div className="flex gap-2">
        <div className="w-1/2">
          <label className="text-sm">
            Department <span className="text-red-400">*</span>
          </label>
          <Controller
            name="departmenData"
            control={control}
            rules={{ required: "Department is required" }}
            render={({ field }) => (
              <Select
                onChange={field.onChange}
                options={departmentDataFiltered}
                placeholder="Select a Department"
                isClearable
                aria-invalid={!!errors.departmenData}
              />
            )}
          />
          {errors.departmenData && (
            <span className="text-xs text-red-500">
              {errors.departmenData.message}
            </span>
          )}
        </div>
        {/* Always show sub-department field, but disable for specific departments */}
        {(() => {
          const selectedDeptId = Number(departmentId?.value);
          const hideSubDeptForDepts = [4, 5, 6, 7, 8];
          const shouldDisableSubDept = hideSubDeptForDepts.includes(selectedDeptId);
          
          return (
            <div className="w-1/2">
              <label className="text-sm">
                Sub Department <span className="text-red-400">*</span>
              </label>
              <Controller
                name="subDepartmentData"
                control={control}
                rules={{
                  required: (() => {
                    const selectedDeptId = Number(departmentId?.value);
                    const hideSubDeptForDepts = [4, 5, 6, 7, 8];
                    const shouldDisableSubDept = hideSubDeptForDepts.includes(selectedDeptId);
                    return !shouldDisableSubDept ? "Sub Department is required" : false;
                  })()
                }}
                render={({ field }) => (
                  <Select
                    onChange={field.onChange}
                    options={suDeptDataFiltered}
                    placeholder="Select a Sub Department"
                    isClearable
                    isDisabled={shouldDisableSubDept}
                    aria-invalid={!!errors.subDepartmentData}
                  />
                )}
              />
              {errors.subDepartmentData && (
                <span className="text-xs text-red-500">
                  {errors.subDepartmentData.message}
                </span>
              )}
            </div>
          );
        })()}
      </div>

      {/* Designation and Emp Type - Always shown */}
      <div className="flex gap-2">
        <div className="w-1/2">
          <label className="text-sm">
            Designation <span className="text-red-400">*</span>
          </label>
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
            placeholder="Enter designation"
            {...register("designation", {
              required: "Designation is required",
            })}
          />
          {errors.designation && (
            <span className="text-xs text-red-500">
              {errors.designation.message}
            </span>
          )}
        </div>
        <div className="w-1/2">
          <label className="text-sm">
            Emp Type <span className="text-red-400">*</span>
          </label>
          <Controller
            name="natureOfEmployment"
            control={control}
            rules={{ required: "Employee type is required" }}
            render={({ field }) => (
              <Select
                onChange={field.onChange}
                options={typeMapping}
                placeholder="Enter employment type"
                isClearable
                aria-invalid={!!errors.natureOfEmployment}
              />
            )}
          />
          {errors.natureOfEmployment && (
            <span className="text-xs text-red-500">
              {errors.natureOfEmployment.message}
            </span>
          )}
        </div>
      </div>

      {/* Date of Joining - Always shown */}
      <div className="flex gap-2">
        <div className="w-1/2">
          <label className="text-sm">
            Date of Joining <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
            {...register("dateOfJoining", { required: "Date of joining is required" })}
          />
          {errors.dateOfJoining && (
            <span className="text-xs text-red-500">
              {errors.dateOfJoining.message}
            </span>
          )}
        </div>
        {/* Empty div for spacing when in TBH mode */}
        {mode === 'normal' && (
          <div className="w-1/2">
            <label className="text-sm">
              Project
            </label>
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              placeholder="Enter project name"
              {...register("project")}
            />
            {errors.project && (
              <span className="text-xs text-red-500">
                {errors.project.message}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Only show these fields for Normal mode */}
      {mode === 'normal' && (
        <>
          {/* Employee Number Field */}
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="text-sm">
                Employee Number <span className="text-red-400">*</span>
              </label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
                placeholder="Enter employee number"
                {...register("empNo", {
                  required: "Employee number is required",
                })}
              />
              {errors.empNo && (
                <span className="text-xs text-red-500">{errors.empNo.message}</span>
              )}
            </div>
            <div className="w-1/2">
              <label className="text-sm">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
                placeholder="Enter staff email"
                {...register("email", { required: "Email required is required" })}
              />
              {errors.email && (
                <span className="text-xs text-red-500">{errors.email.message}</span>
              )}
            </div>
          </div>

          {/* State and Location - Only for Normal mode */}
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="text-sm">
                State <span className="text-red-400">*</span>
              </label>
              <Controller
                name="stateData"
                control={control}
                rules={{ required: "State is required" }}
                render={({ field }) => (
                  <Select
                    onChange={field.onChange}
                    options={statesData}
                    placeholder="Select a state"
                    isClearable
                    aria-invalid={!!errors.stateData}
                  />
                )}
              />
              {errors.stateData && (
                <span className="text-xs text-red-500">{errors.stateData.message}</span>
              )}
            </div>
            <div className="w-1/2">
              <label className="text-sm">
                Location <span className="text-red-400">*</span>
              </label>
              <Controller
                name="locationData"
                control={control}
                rules={{ required: "Location is required" }}
                render={({ field }) => (
                  <Select
                    onChange={field.onChange}
                    options={locationsData}
                    placeholder="Select a location"
                    isClearable
                    aria-invalid={!!errors.locationData}
                  />
                )}
              />
              {errors.locationData && (
                <span className="text-xs text-red-500">
                  {errors.locationData.message}
                </span>
              )}
            </div>
          </div>
        </>
      )}

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
  );
};

export default BasicDetails;

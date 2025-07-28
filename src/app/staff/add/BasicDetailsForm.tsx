import React, { useEffect } from "react";
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
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StaffFormData>({
    defaultValues: activeStaffDetails,
  });
  const stateName = watch("stateData");
  const departmentId = watch("departmenData")

  // const addStaffMutation = api.post.addStaff.useMutation();

  const { mutate: addStaff } = api.post.addStaff.useMutation({
    async onSuccess(data) {
      await apiContext.get.getStaffs.invalidate();
      if (data.staff) {
        setActiveStaffId(data.staff?.id);
      }
      refetchStaffs();
    },
    onError(err) {
      console.error("Error adding staff:", err);
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
      const submissionData = {
        ...data,
        natureOfEmployment:data.natureOfEmployment.value.toString(),
        createdBy: userData.data?.user.id ?? 1,
        isactive: true,
        createdAt: new Date().toISOString().split("T")[0] ?? "",
        stateId: data.stateData.label.toString(),
        locationId: data.locationData.label.toString(),
        departmentId: Number(data.departmenData.value),
        level:Number(data.levelData.value),
        subDeptId: data.subDepartmentData?.value ? Number(data.subDepartmentData.value) : null
      };
      setActiveStaffDetails(submissionData);
      addStaff(submissionData);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-2">
        <div className="w-1/2">
          <label className="text-sm">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
            placeholder="Enter staff name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <span className="text-xs text-red-500">{errors.name.message}</span>
          )}
        </div>
        {/* Employee Number Field */}
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
      </div>
      <div className="flex gap-2">
        <div className="w-1/2">
          <label className="text-sm">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
            placeholder="Enter staff email"
            {...register("email", { required: "Email required is required" })}
          />
          {errors.name && (
            <span className="text-xs text-red-500">{errors.name.message}</span>
          )}
        </div>
        {/* Level Dropdown */}
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
      <div className="flex gap-2">
        {/* State Dropdown */}
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
        {/* Location Dropdown */}
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
      <div className="flex gap-2">
        {/* department */}
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
        {/* Sub department  */}
        <div className="w-1/2">
          <label className="text-sm">
            Sub Department <span className="text-red-400">*</span>
          </label>
          <Controller
            name="subDepartmentData"
            control={control}
            render={({ field }) => (
              <Select
                onChange={field.onChange}
                options={suDeptDataFiltered}
                placeholder="Select a Sub Department"
                isClearable
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
      </div>
          
      <div className="flex gap-2">
        {/* Designation Field */}
        <div className="w-1/2">
          <label className="text-sm">
            Designation <span className="text-red-400">*</span>
          </label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
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
        {/* Project Field */}
        <div className="w-1/2">
          <label className="text-sm">
            Project
          </label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
            placeholder="Enter project name"
            {...register("project")}
          />
          {errors.project && (
            <span className="text-xs text-red-500">
              {errors.project.message}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        {/* Emp Type */}
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

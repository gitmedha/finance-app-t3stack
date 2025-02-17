import React from "react";
import { useForm,  Controller } from "react-hook-form";
// import { Button, Flex } from "@radix-ui/themes";
import Select from "react-select";
import { type StaffItem } from "../staff";
// import { MdCancel } from "react-icons/md";
interface ItemDetailProps {
  item: StaffItem;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetchStaffs: () => void;
}
const typeMapping = [
  { label: "Full Time Consultant", value: "FTC" },
  { label: "Full Time Employee", value: "FTE" },
  { label: "On Contract", value: "CON" },
  { label: "Full Time Consultant (M.Corp)", value: "FTCM" },
  { label: "Part time Consultant", value: "PTC" }
]

const BasicDetails: React.FC<ItemDetailProps> = ({
  item,
  // setIsModalOpen,

}) => {
  const {
    register,
    control,
    formState: { errors },

  } = useForm<StaffItem>({
    defaultValues: item,
  });

  return (
    <form >
      <div className="flex gap-2">
        {/* Name Field */}
        <div className="w-1/2">
          <div>
            <label className="text-sm">Name</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              placeholder="Enter staff name"
              disabled={true}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <span className="text-xs text-red-500">{errors.name.message}</span>
            )}
          </div>
        </div>

        {/* Employee Number Field */}
        <div className="w-1/2">
          <div>
            <label className="text-sm">Employee Number</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              placeholder="Enter employee number"
              disabled={true}
              {...register("empNo", {
                required: "Employee number is required",
              })}
            />
            {errors.empNo && (
              <span className="text-xs text-red-500">{errors.empNo.message}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {/* State Dropdown */}
        <div className="w-1/2">
          <div>
            <label className="text-sm" >State</label>
            <Controller
              name="statesData"
              control={control}
              render={({ field }) => (
                <Select
                className="!disabled:text-black"
                  onChange={field.onChange}
                  isDisabled={true}
                  defaultValue={item.statesData}
                  placeholder="Select a state"
                  isClearable
                  aria-invalid={!!errors.state}
                />
              )}
            />

            {errors.state && (
              <span className="text-xs text-red-500">{errors.state.message}</span>
            )}
          </div>
        </div>
        {/* Location Dropdown */}
        <div className="w-1/2">
          <div>
            <label className="text-sm">Location</label>
            <Controller
              name="locationData"
              disabled={true}
              control={control}
              render={({ field }) => (
                <Select
                  onChange={field.onChange}
                  isDisabled={true}
                  defaultValue={item.locationData}
                  placeholder="Select a location"
                  isClearable
                  aria-invalid={!!errors.location}
                />
              )}
            />
            {errors.location && (
              <span className="text-xs text-red-500">
                {errors.location.message}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="w-1/2">
          {/* Designation Field */}
          <div>
            <label className="text-sm">Designation</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              placeholder="Enter designation"
              disabled={true}
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
        </div>

        <div className="w-1/2">
          <label className="text-sm">Emp Type</label>
          <Controller
            name="typeData"
            control={control}
            render={({ field }) => (
              <Select
              isDisabled={true}
                onChange={field.onChange}
                defaultValue={typeMapping.find((map) => map.value == item.nature_of_employment)}
                options={typeMapping}
                placeholder="Enter employment type"
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
      </div>


      <div className="flex gap-2">
        <div className="w-1/2">
          <label className="text-sm">Department</label>
          <Controller
            name="departmentData"
            disabled={true}
            control={control}
            render={({ field }) => (
              <Select
                onChange={field.onChange}
                isDisabled={true}
                defaultValue={item.departmentData}
                placeholder="Select a Department"
                isClearable
                aria-invalid={!!errors.department}
              />
            )}
          />
          {errors.department && (
            <span className="text-xs text-red-500">
              {errors.department.message}
            </span>
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
            disabled={true}
            render={({ field }) => (
              <Select
                onChange={field.onChange}
                isDisabled={true}
                defaultValue={item.levelData}
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
      
      {/* Sub department */}
      <div className="w-full" >
        <label className="text-sm">Sub Department</label>
        <Controller
          name="subDeptData"
          control={control}
          
          disabled={true}
          render={({ field }) => (
            <Select
              onChange={field.onChange}
              isDisabled={true}
              defaultValue={item.subDeptData}
              placeholder="Select a Sub Department"
              isClearable
              aria-invalid={!!errors.subDepartment}
            />
          )}
        />
        {errors.subDepartment && (
          <span className="text-xs text-red-500">
            {errors.subDepartment.message}
          </span>
        )}
      </div>

      {/* <Flex gap="3" mt="4" justify="end">
        
      </Flex> */}
    </form>
  );
};

export default BasicDetails;

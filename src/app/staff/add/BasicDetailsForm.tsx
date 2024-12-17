import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { Button, Flex } from "@radix-ui/themes";
import { api } from "~/trpc/react";
import Select from "react-select";
import { type ISelectItem } from "../../common/types/genericField";

interface ItemDetailProps {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface StaffFormData {
    name: string;
    empNo: string;
    state: ISelectItem;
    location: ISelectItem;
    department: ISelectItem;
    designation: string;
    isactive: boolean;
    natureOfEmployment: string;
    createdBy: number;
    createdAt: string; // Date in ISO format
  }

const BasicDetails: React.FC<ItemDetailProps> = ({ setIsModalOpen }) => {
    const userData = useSession();
    const apiContext = api.useContext();
    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<StaffFormData>({
        defaultValues: {},
    });
    const stateName = watch("state");

    const addStaffMutation = api.post.addStaff.useMutation();
    const { data: departmentData } = api.get.getAllDepartments.useQuery();
    const { data: statesData } = api.get.getAllStates.useQuery();
    const { data: locationsData = [], refetch } =
        api.get.getAllLocations.useQuery({
            stateName: stateName?.label,
        });

    const onSubmit: SubmitHandler<StaffFormData> = async (data) => {

        try {
            const submissionData = {
                ...data,
                createdBy: userData.data?.user.id ?? 1,
                isactive: true,
                createdAt: new Date().toISOString().split("T")[0] ?? "",
                stateId: Number(data.state.value),
                locationId: Number(data.location.value),
                department: Number(data.department.value),
            };
            await addStaffMutation.mutateAsync(submissionData);
            await apiContext.get.getStaffs.invalidate();
            reset();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding staff:", error);
        }
    };

    useEffect(() => {
        void refetch();
    }, [refetch, stateName]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <div>
                <label className="text-sm">
                    Name <span className="text-red-400">*</span>
                </label>
                <input
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
                    placeholder="Enter staff name"
                    {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                    <span className="text-xs text-red-500">
                        {errors.name.message}
                    </span>
                )}
            </div>

            {/* Employee Number Field */}
            <div>
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
                    <span className="text-xs text-red-500">
                        {errors.empNo.message}
                    </span>
                )}
            </div>

            {/* State Dropdown */}
            <div>
                <label className="text-sm">
                    State <span className="text-red-400">*</span>
                </label>
                <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                        <Select
                            onChange={field.onChange}
                            options={statesData}
                            placeholder="Select a state"
                            isClearable
                            aria-invalid={!!errors.state}
                        />
                    )}
                />

                {errors.state && (
                    <span className="text-xs text-red-500">
                        {errors.state.message}
                    </span>
                )}
            </div>

            {/* Location Dropdown */}
            <div>
                <label className="text-sm">
                    Location <span className="text-red-400">*</span>
                </label>
                <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                        <Select
                            onChange={field.onChange}
                            options={locationsData}
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

            {/* Designation Field */}
            <div>
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

            <div>
                <label className="text-sm">
                    Department <span className="text-red-400">*</span>
                </label>
                <Controller
                    name="department"
                    control={control}
                    render={({ field }) => (
                        <Select
                            onChange={field.onChange}
                            options={departmentData}
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

            {/* Emp Type */}
            <div>
                <label className="text-sm">Emp Type</label>
                <input
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none"
                    placeholder="Enter employment type"
                    {...register("natureOfEmployment")}
                />
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
    );
};

export default BasicDetails;

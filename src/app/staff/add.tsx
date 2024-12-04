

'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { IconButton, Button, Flex } from '@radix-ui/themes';
import Modal from '../_components/Modal';
import { BiPlus } from 'react-icons/bi';
import { api } from '~/trpc/react';
import Select from 'react-select'
interface StaffFormData {
    name: string;
    empNo: string;
    state: number;
    location: number;
    department: number;
    designation: string;
    isactive: boolean;
    natureOfEmployment: string;
    createdBy: number;
    createdAt: string; // Date in ISO format
}

const AddStaff: React.FC = () => {
    //   const addStaffMutation = api.post.addStaff.useMutation();
    const { data: statesData } = api.get.getAllStates.useQuery();
    const { data: locationsData } = api.get.getAllLocations.useQuery();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<StaffFormData>({
        defaultValues: {
            isactive: true,
            createdBy: 1, // Replace with logged-in user ID
            createdAt: new Date().toISOString().split('T')[0], // Default to today's date
        },
    });

    const onSubmit: SubmitHandler<StaffFormData> = async (data) => {
        try {
            const submissionData = {
                ...data,
                state: Number(data.state),
                location: Number(data.location),
                department: Number(data.department),
            };
            //   await addStaffMutation.mutateAsync(submissionData);
            //   reset();
            //   setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding staff:", error);
        }
    };

    // Options for react-select
    const stateOptions = statesData?.states?.map((state: any) => ({
        value: state.id,
        label: state.name,
    }));

    console.log(stateOptions)
    return (
        <>
            <IconButton
                className='!bg-primary !h-8 !w-8 !cursor-pointer'
                onClick={() => setIsModalOpen(true)}
            >
                <BiPlus size={20} />
            </IconButton>

            <Modal
                title="Add Staff"
                description=""
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Name Field */}
                    <div>
                        <label className='text-sm'>
                            Name <span className='text-red-400'>*</span>
                        </label>
                        <input
                            className="border rounded-lg px-3 py-2 text-sm w-full outline-none mt-1"
                            placeholder="Enter staff name"
                            {...register("name", { required: "Name is required" })}
                        />
                        {errors.name && (
                            <span className='text-red-500 text-xs'>{errors.name.message}</span>
                        )}
                    </div>

                    {/* Employee Number Field */}
                    <div>
                        <label className='text-sm'>
                            Employee Number <span className='text-red-400'>*</span>
                        </label>
                        <input
                            className="border rounded-lg px-3 py-2 text-sm w-full outline-none mt-1"
                            placeholder="Enter employee number"
                            {...register("empNo", { required: "Employee number is required" })}
                        />
                        {errors.empNo && (
                            <span className='text-red-500 text-xs'>{errors.empNo.message}</span>
                        )}
                    </div>

                    {/* State Dropdown */}
                    <div>
                        <label className='text-sm'>
                            State <span className='text-red-400'>*</span>
                        </label>
                        <Controller
                            name="state"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={stateOptions || []}
                                    placeholder="Select a state"
                                    isClearable
                                    aria-invalid={!!errors.state}
                                />
                            )}
                        />


                        {errors.state && (
                            <span className='text-red-500 text-xs'>{errors.state.message}</span>
                        )}
                    </div>

                    {/* Location Dropdown */}
                    <div>
                        <label className='text-sm'>
                            Location <span className='text-red-400'>*</span>
                        </label>
                        <select
                            className="border rounded-lg px-3 py-2 text-sm w-full outline-none mt-1"
                            {...register("location", { required: "Location is required" })}
                        >
                            <option value="">Select a location</option>
                            {/* {locationsData?.map((location: any) => (
                                <option key={location.id} value={location.id}>
                                    {location.name}
                                </option>
                            ))} */}
                        </select>
                        {errors.location && (
                            <span className='text-red-500 text-xs'>{errors.location.message}</span>
                        )}
                    </div>

                    {/* Designation Field */}
                    <div>
                        <label className='text-sm'>
                            Designation <span className='text-red-400'>*</span>
                        </label>
                        <input
                            className="border rounded-lg px-3 py-2 text-sm w-full outline-none mt-1"
                            placeholder="Enter designation"
                            {...register("designation", { required: "Designation is required" })}
                        />
                        {errors.designation && (
                            <span className='text-red-500 text-xs'>{errors.designation.message}</span>
                        )}
                    </div>

                    {/* Nature of Employment */}
                    <div>
                        <label className='text-sm'>
                            Nature of Employment
                        </label>
                        <input
                            className="border rounded-lg px-3 py-2 text-sm w-full outline-none mt-1"
                            placeholder="Enter employment type"
                            {...register("natureOfEmployment")}
                        />
                    </div>

                    <Flex gap="3" mt="4" justify="end">
                        <Button
                            onClick={() => setIsModalOpen(false)}
                            type='button'
                            className='!cursor-pointer'
                            variant="soft"
                            color="gray"
                        >
                            Cancel
                        </Button>
                        <Button type='submit' className='!cursor-pointer'>
                            Save
                        </Button>
                    </Flex>
                </form>
            </Modal>
        </>
    );
};

export default AddStaff;

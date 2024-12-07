// pages/ProfileEditPage.tsx

import React, { useState, useEffect } from 'react';
import { TextField, Text, IconButton, Flex, Button,} from '@radix-ui/themes';
import Modal from '../_components/Modal';
import { MdEdit } from "react-icons/md";
import type { ItemDetailProps } from "./donor";
import { api } from "~/trpc/react";
import { useSession } from 'next-auth/react';
import Select from 'react-select'
import { useForm,Controller} from "react-hook-form";

const EditDonor: React.FC<ItemDetailProps> = ({ item }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const editDonorMutation = api.post.editDonor.useMutation();
    const { data: costCentersData } = api.get.getCostCenters.useQuery({});

    const userData = useSession();
    const {
        control,
        formState: { errors },
    } = useForm<ItemDetailProps>({
    });
    // State to track form inputs
    const [formData, setFormData] = useState({
        id:'',
        name: '',
        costCenter: 1,
        finYear: 0,
        totalBudget: 0,
        budgetReceived: 0,
        status: '',
        currency: '',
        type: '',
    });

    // Update formData when the modal opens with existing item data
    useEffect(() => {
        if (isModalOpen && item) {
            console.log(item);
            console.log("item?.costCenter",item?.costCenter);
            
            setFormData({
                id: item?.id ,
                name: item.name || '',
                costCenter: item?.costCenter|| 1,
                finYear: item?.finYear || 0,
                totalBudget: item?.totalBudget || 0,
                budgetReceived: item?.budgetReceived || 0,
                status: item.isactive ? 'Active' : 'Inactive', // example, adjust based on logic
                currency: item.currency || '',
                type: item.type || '',
            });
        }
    }, [isModalOpen, item]);

    // Handle form field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e.target){
            setFormData((prev) => ({
                ...prev,
                costCenter:e.value,
            }));
        }else{
            const { name:lable, value } = e.target;
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

    };

    const handleSave = async() => {
        try{
            console.log('Saved donor data:', formData);
            const donorData={
                ...formData,
                totalBudget: parseInt(formData?.totalBudget)||0,
                budgetReceived: parseInt(formData?.budgetReceived)||0,
                updatedBy: userData?.data?.user.id ?? 1,
                updatedAt: new Date().toISOString().split("T")[0] ?? "",

            }
            await editDonorMutation.mutateAsync(donorData);

            setIsModalOpen(false);
    } catch (error) {
        console.error("Error adding staff:", error);
      }
    };
    const costCentersOptions = costCentersData?.costCenters?.map((costCenter: any) => ({
        value:costCenter?.id,
        label: costCenter?.name,
    }));


    return (
        <>
            <IconButton className='!bg-primary !h-7 !w-7 !cursor-pointer' onClick={() => setIsModalOpen(true)}>
                <MdEdit size={20} />
            </IconButton>

            <Modal
                title="Edit Donor"
                description="Make changes to your donor."
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            >
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Name
                        </Text>
                        <TextField.Root
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter the donor's name"
                        />
                    </label>

                    <div>
                    <Text as="div" size="2" mb="1" weight="bold">
                            Cost Center
                        </Text>
                        <Controller
                            name="costCenter"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    defaultValue={costCentersOptions.find(option => option.value == formData.costCenter)} 
                                    onChange={handleChange}
                                    options={costCentersOptions || []}
                                    placeholder="Select a cost center"
                                    isClearable

                                    aria-invalid={!!errors.costCenter}
                                />
                            )}
                        />


                        {errors.costCenter && (
                            <span className='text-red-500 text-xs'>{errors.costCenter.message}</span>
                        )}
                    </div>


                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Financial Year
                        </Text>
                        <TextField.Root
                            name="finYear"
                            type="number"
                            value={formData.finYear}
                            onChange={handleChange}
                            placeholder="Enter financial year"
                        />
                    </label>

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Total Budget
                        </Text>
                        <TextField.Root
                            name="totalBudget"
                            type="number"
                            value={formData.totalBudget}
                            onChange={handleChange}
                            placeholder="Enter total budget"
                        />
                    </label>

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Received Budget
                        </Text>
                        <TextField.Root
                            name="budgetReceived"
                            type="number"
                            value={formData.budgetReceived}
                            onChange={handleChange}
                            placeholder="Enter received budget"
                        />
                    </label>

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Status
                        </Text>
                        <TextField.Root
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            placeholder="Enter donor status"
                        />
                    </label>

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Currency
                        </Text>
                        <TextField.Root
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            placeholder="Enter currency"
                        />
                    </label>

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Type
                        </Text>
                        <TextField.Root
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            placeholder="Enter donor type"
                        />
                    </label>

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
                            className="!cursor-pointer"
                        >
                            Save
                        </Button>
                    </Flex>
                </form>
            </Modal>
        </>
    );
};

export default EditDonor;

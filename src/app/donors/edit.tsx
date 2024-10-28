// pages/ProfileEditPage.tsx

import React, { useState } from 'react';
import { TextField, Text, IconButton } from '@radix-ui/themes';
import Modal from '../_components/Modal';
import { MdOutlineEdit } from "react-icons/md";

interface FilterOptions {
    Name: string,
    CostCenter: string,
    Year: string,
    TotalBudget:number,
    ReceivedBudget: number,
    Currency: string,
    Type: string,
    CreatedAt: string,
}

interface ItemDetailProps {
    item: FilterOptions;
}

const EditDonor: React.FC<ItemDetailProps> = ({ item }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSave = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <IconButton className='!bg-primary !h-7 !w-7 !cursor-pointer' onClick={() => setIsModalOpen(true)}>
                <MdOutlineEdit size={20} />
            </IconButton>

            <Modal
                title="Add Donor"
                description="Make changes to your profile."
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            >
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Name
                    </Text>
                    <TextField.Root defaultValue={item?.Name} placeholder="Enter your Amount" />
                </label>
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Description
                    </Text>
                    <TextField.Root defaultValue={item?.TotalBudget.toString()} placeholder="Enter your Description" />
                </label>
            </Modal>
        </>
    );
};

export default EditDonor;

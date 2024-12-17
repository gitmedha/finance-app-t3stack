// pages/ProfileEditPage.tsx

import React, { useState } from 'react';
import { TextField, Text, IconButton } from '@radix-ui/themes';
import Modal from '../_components/Modal';
import { MdEdit } from "react-icons/md";

interface FilterOptions {
    Date: string,
    Amount: number,
    Currency: string,
    Category: string,
    CostCenter: string,
    Description: string,
    Status: string,
    Type: string,
    CreatedAt: string,
}

interface ItemDetailProps {
    item: FilterOptions;
}

const EditExpense: React.FC<ItemDetailProps> = ({ item }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSave = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <IconButton className='!bg-primary !h-7 !w-7 !cursor-pointer' onClick={() => setIsModalOpen(true)}>
                <MdEdit size={20} />
            </IconButton>

            <Modal
                className=''
                title="Add Expense"
                description="Make changes to your profile."
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            >
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Name
                    </Text>
                    <TextField.Root defaultValue={item?.Amount.toString()} placeholder="Enter your Amount" />
                </label>
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Description
                    </Text>
                    <TextField.Root defaultValue={item?.Description} placeholder="Enter your Description" />
                </label>
            </Modal>
        </>
    );
};

export default EditExpense;

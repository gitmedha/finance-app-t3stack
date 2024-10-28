// pages/ProfileEditPage.tsx

import React, { useState } from 'react';
import { TextField, Text, IconButton } from '@radix-ui/themes';
import Modal from '../_components/Modal';
import { MdEdit } from "react-icons/md";

interface FilterOptions {
    id: number,
    date:string,
    description:string,
    category:string,
    amount:string,
    status:string,
}

interface ItemDetailProps {
    item: FilterOptions;
}

const EditBudget: React.FC<ItemDetailProps> = ({ item }) => {
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
                title="Add Budget"
                description="Make changes to your profile."
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            >
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Name
                    </Text>
                    <TextField.Root defaultValue={item?.amount} placeholder="Enter your Amount" />
                </label>
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Description
                    </Text>
                    <TextField.Root defaultValue={item?.description} placeholder="Enter your Description" />
                </label>
            </Modal>
        </>
    );
};

export default EditBudget;

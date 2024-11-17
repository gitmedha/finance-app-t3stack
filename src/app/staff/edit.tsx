// pages/ProfileEditPage.tsx

import React, { useState } from 'react';
import { TextField, Text, IconButton } from '@radix-ui/themes';
import Modal from '../_components/Modal';
import { MdEdit } from "react-icons/md";
import type { Staff } from "./staff";

interface ItemDetailProps {
    item: Staff;
}

const EditStaff: React.FC<ItemDetailProps> = ({ item }) => {
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
                title="Add Staff"
                description="Make changes to your profile."
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            >
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Name
                    </Text>
                    <TextField.Root defaultValue={item?.name} placeholder="Enter your full name" />
                </label>
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Department
                    </Text>
                    <TextField.Root defaultValue={item?.departmentname || ''} placeholder="Enter your Department" />
                </label>
            </Modal>
        </>
    );
};

export default EditStaff;

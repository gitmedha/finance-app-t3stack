// pages/ProfileEditPage.tsx

import React, { useState } from 'react';
import { TextField, Text, IconButton } from '@radix-ui/themes';
import Modal from '../_components/Modal';
import { BiPlus } from 'react-icons/bi';

const AddDepartment: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSave = () => {
        // Save profile logic
        setIsModalOpen(false);
    };

    return (
        <>
            <IconButton className='!bg-primary !h-8 !w-8 !cursor-pointer' onClick={() => setIsModalOpen(true)}>
                <BiPlus size={20} />
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
                    <TextField.Root placeholder="Enter your full name" />
                </label>
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Email
                    </Text>
                    <TextField.Root placeholder="Enter your email" />
                </label>
            </Modal>
        </>
    );
};

export default AddDepartment;


import React, { useState } from 'react';
import { TextField, Text, IconButton } from '@radix-ui/themes';
import Modal from '../_components/Modal';
import { MdDelete } from "react-icons/md";


interface FilterOptions {
    Name: string,
    Code: string,
    Type: string,
    ParentDept: string,
    CreatedAt: string,
}


interface ItemDetailProps {
    item: FilterOptions;
}

const DeleteDepartment: React.FC<ItemDetailProps> = ({ item }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSave = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <IconButton className='!bg-primary !h-7 !w-7 !cursor-pointer' onClick={() => setIsModalOpen(true)}>
                <MdDelete size={20} />
            </IconButton>

            <Modal
                title="Delete Department"
                description="Are You sure you want to delete ?"
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            >
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Name
                    </Text>
                    <TextField.Root defaultValue={item?.Name} placeholder="Enter your Full Name" />
                </label>
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Description
                    </Text>
                    <TextField.Root defaultValue={item?.ParentDept} placeholder="Enter your Parent Dept" />
                </label>
            </Modal>
        </>
    );
};

export default DeleteDepartment;

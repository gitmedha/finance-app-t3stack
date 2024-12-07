
import React, { useState } from 'react';
import {  IconButton, Flex, Button} from '@radix-ui/themes';
import Modal from '../_components/Modal';
import { MdDelete } from "react-icons/md";
import type { ItemDetailProps} from "./donor";
import { api } from "~/trpc/react";


const DeleteDonor: React.FC<ItemDetailProps> = ({ item }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const deleteDonorMutation = api.delete.deleteDonor.useMutation()

    const handleDelete = async () => {
      try {
        await deleteDonorMutation.mutateAsync({ id: item.id })
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error adding staff:", error);
      }
    };
  
    const handleSave = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <IconButton className='!bg-primary !h-7 !w-7 !cursor-pointer' onClick={() => setIsModalOpen(true)}>
                <MdDelete size={20} />
            </IconButton>

            <Modal
                title="Delete Donor"
                description="Are You sure you want to delete ?"
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            >
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
            <Button onClick={handleDelete} color="red" className="!cursor-pointer">
              Delete
            </Button>
          </Flex>
            </Modal>
        </>
    );
};

export default DeleteDonor;

import React, { useState } from "react";
import { IconButton, Flex, Button } from "@radix-ui/themes";
import Modal from "../_components/Modal";
import { MdDelete } from "react-icons/md";
import type { StaffItem } from "./staff";
import { api } from "~/trpc/react";
interface ItemDetailProps {
  item: StaffItem;
}

const DeleteStaff: React.FC<ItemDetailProps> = ({ item }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteStaffMutation = api.delete.deleteStaff.useMutation()

  const handleDelete = async () => {
    try {
      await deleteStaffMutation.mutateAsync({ id: item.id })
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  return (
    <>
      <IconButton
        className="!h-7 !w-7 !cursor-pointer !bg-primary"
        onClick={() => setIsModalOpen(true)}
      >
        <MdDelete size={20} />
      </IconButton>

      <Modal
        className=''
        title="Delete Staff"
        description="Are you sure you want to delete this staff?"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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

export default DeleteStaff;

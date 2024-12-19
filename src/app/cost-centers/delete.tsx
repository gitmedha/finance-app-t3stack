import React, { useState } from "react";
import { IconButton, Flex, Button } from "@radix-ui/themes";
import Modal from "../_components/Modal";
import { MdDelete } from "react-icons/md";
import { api } from "~/trpc/react";
import { type costCenters } from "./cost-center";
interface ItemDetailProps {
  item: costCenters;
  refetch: () => void;
}

const DeleteCostCenter: React.FC<ItemDetailProps> = ({ item, refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteCostCenterMutation = api.delete.deleteCostCenter.useMutation();

  const handleDelete = async () => {
    try {
      await deleteCostCenterMutation.mutateAsync({ id: item.id });
      refetch();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error delete cost center:", error);
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
        title="Delete Cost Center"
        description="Are you sure you want to delete this cost center?"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className={""}
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
          <Button
            onClick={handleDelete}
            color="red"
            className="!cursor-pointer"
          >
            Delete
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

export default DeleteCostCenter;

import React, { useState } from "react";
import { IconButton, Flex, Button } from "@radix-ui/themes";
import Modal from "../_components/Modal";
import { MdDelete } from "react-icons/md";
import { api } from "~/trpc/react";
import { type Department } from "./department";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { TRPCClientError } from "@trpc/client";
interface ItemDetailProps {
  item: Department;
  refetch: () => void;
}

const DeleteDepartment: React.FC<ItemDetailProps> = ({ item, refetch }) => {
  const userData = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteDepartmentMutation = api.delete.deleteDepartment.useMutation();

  const handleDelete = async () => {
    try {
      await deleteDepartmentMutation.mutateAsync({
        id: item.id, updatedBy: userData.data?.user.id ?? 1,
        updatedAt: new Date().toISOString().split("T")[0] ?? "", });
      refetch();
      setIsModalOpen(false);
      toast.success('Successfully Deactivated Department', {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error("Error delete department:", error);
      let errorMessage = "Something went wrong. Please try again.";

      if (error instanceof TRPCClientError) {
        errorMessage = error.message; // Extract proper tRPC error message
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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
        title="Delete Department"
        description="Are you sure you want to delete this department?"
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

export default DeleteDepartment;

"use client";

import React, { useState } from "react";
import { IconButton, Flex, Button } from "@radix-ui/themes";
import Modal from "../_components/Modal";
import { MdDelete } from "react-icons/md";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { TRPCClientError } from "@trpc/client";
import type { DeleteProps } from "./program-activity";



const DeleteProgramActivity: React.FC<DeleteProps> = ({ item, refetchProgramActivities }) => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteProgramActivityMutation = api.delete.deleteProgramActivity.useMutation();

  const handleDelete = async () => {
    try {
      await deleteProgramActivityMutation.mutateAsync({
        id: item.id, 
        updatedBy: session?.user.id ?? 1,
        updatedAt: new Date().toISOString().split("T")[0] ?? "", 
      });
      
      refetchProgramActivities();
      setIsModalOpen(false);
      
      toast.success('Program activity deactivated successfully', {
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
      console.error("Error deactivating program activity:", error);
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
        title="Delete Program Activity"
        description={`Are you sure you want to delete program activity "${item.name}"?`}
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

export default DeleteProgramActivity;
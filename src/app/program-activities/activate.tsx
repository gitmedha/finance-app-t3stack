"use client";

import React, { useState } from "react";
import { IconButton, Flex, Button } from "@radix-ui/themes";
import Modal from "../_components/Modal";
import { FaUndoAlt } from "react-icons/fa";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { TRPCClientError } from "@trpc/client";
import type { ProgramActivityItem } from "./program-activity";

interface ActivateProps {
  item: ProgramActivityItem;
  refetchProgramActivities: () => void;
}

export default function ActivateProgramActivity({
  item,
  refetchProgramActivities,
}: ActivateProps) {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // No need to query for activity since we already have it in the item prop
  const name = item?.name ?? "this activity";
  const activityId = item?.id;

  const reactivate = api.post.reactivateProgramActivity.useMutation();

  const handleActivate = async () => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to perform this action", {
        position: "bottom-left",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      await reactivate.mutateAsync({
        id: activityId,
        updatedBy: session.user.id,
        updatedAt: new Date().toISOString().split("T")[0] ?? "",
      });

      toast.success("Program activity reactivated!", {
        position: "bottom-left",
        autoClose: 1000,
      });
      setIsModalOpen(false);
      refetchProgramActivities();
    } catch (err) {
      let msg = "Something went wrong. Please try again.";
      if (err instanceof TRPCClientError) msg = err.message;
      else if (err instanceof Error) msg = err.message;

      toast.error(msg, {
        position: "bottom-left",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <IconButton
        className="!h-7 !w-7 !bg-primary !cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <FaUndoAlt size={16} />
      </IconButton>

      <Modal
        className=""
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Activate Program Activity"
        description={`Are you sure you want to reactivate "${name}"?`}
      >
        <Flex justify="end" gap="3" mt="4">
          <Button
            variant="soft"
            color="gray"
            onClick={() => setIsModalOpen(false)}
            disabled={isLoading}
            className="!cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleActivate}
            disabled={isLoading}
            className="!cursor-pointer"
          >
            {isLoading ? "Activating..." : "Activate"}
          </Button>
        </Flex>
      </Modal> 
    </>
  );
}

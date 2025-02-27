import React, { useState } from "react";
import { IconButton, Flex, Button } from "@radix-ui/themes";
import Modal from "../_components/Modal";
import type { StaffItem } from "./staff";
import { api } from "~/trpc/react";
import { FaUndoAlt } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { TRPCClientError } from "@trpc/client";
interface ItemDetailProps {
    item: StaffItem;
    refetchStaffs: () => void;
}

const ActivateStaff: React.FC<ItemDetailProps> = ({ item, refetchStaffs }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userData = useSession()
    const activateStaffMutation = api.post.activateStaff.useMutation()

    const handleDelete = async () => {
        try {
            await activateStaffMutation.mutateAsync({
                id: item.id, 
                updatedBy: userData.data?.user.id ?? 1,
                updatedAt: new Date().toISOString().split("T")[0] ?? "",
             })
            refetchStaffs();
            setIsModalOpen(false);
            toast.success('Successfully Activated Staff', {
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
            console.error("Error adding staff:", error);
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
                <FaUndoAlt size={20} />
            </IconButton>

            <Modal
                className=''
                title="Activate Staff"
                description="Are you sure you want to re-activate this staff?"
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
                    <Button onClick={handleDelete} color="green" className="!cursor-pointer">
                        Activate
                    </Button>
                </Flex>
            </Modal>
        </>
    );
};

export default ActivateStaff;

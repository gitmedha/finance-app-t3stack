"use client";
import React, { useState } from "react";
import { IconButton, Tabs } from "@radix-ui/themes";
import Modal from "../../_components/Modal";
import { FaEye } from "react-icons/fa";
import { type StaffItem } from "../staff";
import BasicDetails from "./BasicDetailsForm";
import SalaryDetailsForm from "./SalaryDetailsForm";
import { useSession } from "next-auth/react";

interface ItemDetailProps {
    item: StaffItem;
    refetch: () => void;
}

const ViewStaff: React.FC<ItemDetailProps> = ({ item, refetch }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userData = useSession()

    return (
        <>
            <IconButton
                className="!h-7 !w-7 !cursor-pointer !bg-primary"
                onClick={() => setIsModalOpen(true)}
            >
                <FaEye size={20} />
            </IconButton>

            <Modal
                className=""
                title="View Staff"
                description=""
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                {/* Tab Container */}
                <Tabs.Root className="w-full" defaultValue="basicDetails">
                    {/* Tab List */}
                    <Tabs.List className="flex border-b">
                        <Tabs.Trigger
                            value="basicDetails"
                            className="!cursor-pointer px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
                        >
                            Basic Details
                        </Tabs.Trigger>
                        {
                            userData.data?.user.role != 3 &&
                            <Tabs.Trigger
                                value="salaryDetails"
                                className="!cursor-pointer px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
                            >
                                Salary Details
                            </Tabs.Trigger>
                        }
                    </Tabs.List>

                    {/* Tab Panels */}
                    <Tabs.Content value="basicDetails" className="p-4">
                        <BasicDetails
                            setIsModalOpen={setIsModalOpen}
                            item={item}
                            refetchStaffs={refetch}
                        />
                    </Tabs.Content>
                    <Tabs.Content value="salaryDetails" className="p-4">
                        <SalaryDetailsForm
                            setIsModalOpen={setIsModalOpen}
                            item={item}
                            refetch={refetch}
                        />
                    </Tabs.Content>

                </Tabs.Root>
            </Modal>
        </>
    );
};

export default ViewStaff;
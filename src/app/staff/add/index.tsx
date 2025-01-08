"use client";

import React, { useState } from "react";
import { IconButton, Tabs } from "@radix-ui/themes";
import Modal from "../../_components/Modal";
import { BiPlus } from "react-icons/bi";
import BasicDetails from "./BasicDetailsForm";
import SalaryDetailsForm from "./SalaryDetailsForm";
import useStaff from "../store/staffStore";

interface AddStaffProps {
  refetch: () => void;
}

const AddStaff: React.FC<AddStaffProps> = ({ refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { activeStaffId } = useStaff();

  return (
    <>
      <IconButton
        className="!h-8 !w-8 !cursor-pointer !bg-primary"
        onClick={() => setIsModalOpen(true)}
      >
        <BiPlus size={20} />
      </IconButton>

      <Modal
        title="Add Staff"
        className=""
        description=""
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Tabs.Root className="w-full" defaultValue="basicDetails">
          {/* Tab List */}
          <Tabs.List className="flex border-b">
            <Tabs.Trigger
              value="basicDetails"
              className="!cursor-pointer px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 data-[state=active]:border-b-2 data-[state=active]:!border-primary data-[state=active]:text-primary"
            >
              Basic Details
            </Tabs.Trigger>
            <Tabs.Trigger
              value="salaryDetails"
              disabled={!activeStaffId}
              className=" disabled:!bg-opacity-5 disabled:!cursor-not-allowed !cursor-pointer px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 data-[state=active]:border-b-2 data-[state=active]:!border-primary data-[state=active]:text-primary"
            >
              Salary Details
            </Tabs.Trigger>
          </Tabs.List>

          {/* Tab Panels */}
          <Tabs.Content value="basicDetails" className="p-4">
            <BasicDetails
              setIsModalOpen={setIsModalOpen}
              refetchStaffs={refetch}
            />
          </Tabs.Content>
          <Tabs.Content value="salaryDetails" className="p-4">
            <SalaryDetailsForm
              setIsModalOpen={setIsModalOpen}
              refetch={refetch}
            />
          </Tabs.Content>
        </Tabs.Root>
      </Modal>
    </>
  );
};

export default AddStaff;

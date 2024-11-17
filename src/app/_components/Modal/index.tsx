// components/Modal.tsx

import React, { FC, ReactNode } from 'react';
import { Dialog } from '@radix-ui/themes';
import { Button } from '@radix-ui/themes';
import { Flex } from '@radix-ui/themes';
import clsx from 'clsx';

interface ModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  children?: ReactNode;
  isLoading?: boolean;
}

const Modal: FC<ModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  // onSave,
  children,
  // isLoading = false
}) => {
  return (

    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content className={clsx(
        "transition-transform duration-300 ease-out transform",
        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95",
        "bg-white p-6 rounded-md shadow-lg max-w-[450px] w-full mx-auto mt-20"
      )} maxWidth="450px">
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {description}
        </Dialog.Description>

        {children}
        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button className='!cursor-pointer' variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button className='!cursor-pointer'>Save</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>

  );
};

export default Modal;

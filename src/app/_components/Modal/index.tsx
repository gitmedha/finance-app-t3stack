// components/Modal.tsx

import React, { FC, ReactNode } from 'react';
import { Dialog,  Button } from '@radix-ui/themes';
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
        "transition-transform duration-900 ease-out transform",
        isOpen ? "opacity-100 scale-100" : "opacity-35 scale-95",
        "bg-white p-6 rounded-md shadow-lg max-w-[450px] w-full mx-auto mt-20"
      )} maxWidth="450px">
        <Dialog.Title>{title}</Dialog.Title>
       {description && <Dialog.Description size="2" mb="4">
          {description}
        </Dialog.Description>}

        {children}
        
      </Dialog.Content>
    </Dialog.Root>

  );
};

export default Modal;

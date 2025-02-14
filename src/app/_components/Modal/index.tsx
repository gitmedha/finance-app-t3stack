// components/Modal.tsx

import React, { type FC, type ReactNode } from 'react';
import { Button, Dialog } from '@radix-ui/themes';
import clsx from 'clsx';
import { MdCancel } from 'react-icons/md';

interface ModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  children?: ReactNode;
  isLoading?: boolean;
  className:string;
  view?:boolean
}

const Modal: FC<ModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  // onSave,
  view,
  children,
  className=""
  // isLoading = false
}) => {
  return (

    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content className={clsx(
        "transition-transform duration-900 ease-out transform",
        isOpen ? "opacity-100 scale-100" : "opacity-35 scale-95",
      `bg-white p-6 rounded-md shadow-lg max-w-[450px] w-full mx-auto mt-20 ${className} overflow-hidden`
      )}>
        <Dialog.Title>
          <div className="flex justify-between">
            {title}
          
            {view && 
              <Button
                onClick={() => onClose()}
                type="button"
                className="!cursor-pointer "
                variant="soft"
                color="red"
              >
                <MdCancel size={20} />
              </Button>
            }
          </div>
        </Dialog.Title>
       {description && <Dialog.Description size="2" mb="4">
          {description}
          
        </Dialog.Description>}

        {children}
        
      </Dialog.Content>
    </Dialog.Root>

  );
};

export default Modal;

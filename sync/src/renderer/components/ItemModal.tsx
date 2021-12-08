import { Heading, Stack } from '@chakra-ui/layout';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import React, { useEffect, useState } from 'react';

import { Spinner } from '@chakra-ui/spinner';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  id: string;
}

const ItemModal: React.FC<ItemModalProps> = ({
  id,
  isOpen,
  onClose,
  onOpen,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (isOpen) {
      window.electron.ipcRenderer
        .getItem(id)
        .then((item) => console.log(item))
        .catch((err) => err);
    }
  }, [isOpen, id]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent as="form">
        <ModalCloseButton />
        <ModalHeader>
          <Stack direction="row" spacing={4} alignItems="center">
            {isLoading && (
              <>
                <Spinner />
                <Heading>Item Details</Heading>
              </>
            )}
          </Stack>
        </ModalHeader>
        <ModalBody>
          <Stack justifyContent="center" alignItems="center" />
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

export default ItemModal;

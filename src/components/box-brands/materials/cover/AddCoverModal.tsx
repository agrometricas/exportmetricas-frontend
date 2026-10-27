import { IconButton, useDisclosure, Dialog, Portal } from '@chakra-ui/react';
import React from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import AddCoverForm from './AddCoverForm';

const AddCoverModal = (): React.JSX.Element => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        position='relative'
        top='-5px'
        ml='5px'
        rounded='full'
        aria-label='agregar cubierta'
        size='xs'
        colorPalette='green'
        variant='ghost'
        onClick={onOpen}
      >
        <AiFillPlusCircle size='20px' />
      </IconButton>
      <Dialog.Root
        open={open}
        size='md'
        onOpenChange={(e) => {
          if (!e.open) {
            onClose();
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.CloseTrigger />
              <Dialog.Body>
                <AddCoverForm onClose={onClose} />
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default AddCoverModal;

import { IconButton, useDisclosure, Dialog, Portal } from '@chakra-ui/react';
import React from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import AddPesticideForm from './AddPesticideForm';

const AddPesticideModal = (): React.JSX.Element => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        position={'relative'}
        top={'-5px'}
        ml={'5px'}
        rounded='full'
        aria-label={'agregar marca'}
        size='xs'
        colorPalette='green'
        variant='ghost'
        onClick={onOpen}
      >
        <AiFillPlusCircle size={'20px'} />
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
                <AddPesticideForm onClose={onClose} />
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default AddPesticideModal;

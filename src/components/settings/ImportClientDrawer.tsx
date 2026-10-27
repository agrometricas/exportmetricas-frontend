import {
  Box,
  Button,
  Drawer,
  Input,
  useDisclosure,
  Text,
  Spinner,
  Image,
  VStack,
  HStack,
  Portal,
  Field,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { useRef, useState } from 'react';
import { toaster } from '@/components/ui/toaster';
import { useImportClients } from '../../hooks/export/client/uploadClients';
import { serverErrorMessage } from '../../utils/serverErrorMessage';

const ImportClientDrawer: React.FC = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [field, meta, helpers] = useField('import-client');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { importClients, isPending: isLoading } = useImportClients({
    config: {
      onSuccess: (data) => {
        toaster.create({
          title: 'Importación exitosa',
          description: data.message,
          type: 'success',
          duration: 5000,
          closable: true,
        });
        resetFile();
        onClose();
      },

      onError: (error) => {
        toaster.create({
          title: 'Error al importar',
          description: serverErrorMessage(error),
          type: 'error',
          duration: 5000,
          closable: true,
        });
      },
    },
  });

  const handleFileChange = (file: File): void => {
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setFileSize(file.size);
      helpers.setValue(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      handleFileChange(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent): void => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent): void => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  const resetFile = (): void => {
    setFileName('');
    setFileSize(0);
    setSelectedFile(null);
    helpers.setValue(null);
  };

  const handleUpload = (): void => {
    if (selectedFile) importClients(selectedFile);
  };

  return (
    <Box>
      <Button py='8px' px='16px' colorPalette='green' onClick={onOpen}>
        Importar clientes
      </Button>

      <Drawer.Root
        open={open}
        placement='end'
        onOpenChange={(e) => {
          if (!e.open) {
            onClose();
          }
        }}
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.CloseTrigger />
              <Drawer.Header>Importar clientes</Drawer.Header>

              <Drawer.Body>
                {fileName ? (
                  <Box
                    borderWidth='1px'
                    borderColor='border'
                    borderRadius='md'
                    p={4}
                    bg='green.subtle'
                    shadow='md'
                  >
                    <HStack justify='space-between'>
                      <VStack align='start' gap={1}>
                        <Text fontWeight='bold' fontSize='lg'>
                          Archivo seleccionado
                        </Text>
                        <Text fontSize='sm' color='fg.muted'>
                          Nombre: <b>{fileName}</b>
                        </Text>
                        <Text fontSize='sm' color='fg.muted'>
                          Tamaño: <b>{(fileSize / 1024).toFixed(2)} KB</b>
                        </Text>
                      </VStack>
                      <Button
                        size='sm'
                        colorPalette='red'
                        variant='outline'
                        onClick={resetFile}
                      >
                        Quitar
                      </Button>
                    </HStack>
                  </Box>
                ) : (
                  <Field.Root id='import-client' width='100%'>
                    <Box
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      border='2px dashed'
                      borderColor={dragging ? 'green.500' : 'gray.300'}
                      borderRadius='md'
                      textAlign='center'
                      bg={dragging ? 'green.50' : 'white'}
                      cursor='pointer'
                    >
                      <Input
                        ref={fileInputRef}
                        id={field.name}
                        type='file'
                        accept='.csv'
                        display='none'
                        onChange={handleChange}
                      />
                      <Field.Label>
                        {isLoading ? (
                          <Spinner />
                        ) : (
                          <Image
                            src={'/uploaded.png'}
                            alt='Subida de archivo'
                            maxH='200px'
                            my={2}
                            mx='auto'
                          />
                        )}
                        <Text p={4} color={dragging ? 'green.500' : 'gray.300'}>
                          {dragging
                            ? 'Suelta aquí...'
                            : 'Arrastra y suelta un archivo aquí, o haz clic para seleccionar uno'}
                        </Text>
                      </Field.Label>
                    </Box>
                  </Field.Root>
                )}
              </Drawer.Body>

              <Drawer.Footer>
                <Button variant='outline' mr={3} onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  py='8px'
                  px='16px'
                  colorPalette='green'
                  disabled={!selectedFile}
                  onClick={handleUpload}
                  loading={isLoading}
                >
                  Subir
                </Button>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Box>
  );
};

export default ImportClientDrawer;

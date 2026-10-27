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
  Link,
  Portal,
  Field,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { useRef, useState } from 'react';
import { toaster } from '@/components/ui/toaster';
import { useImportBusinessStock } from '../../hooks/winery/useImportBusinessStock'; // Nuevo hook
import { useImportExporterStock } from '../../hooks/winery/useImportExporterStock';
import axios from '../../lib/axios';
import { serverErrorMessage } from '../../utils/serverErrorMessage';

const ImportExporterStockDrawer: React.FC = () => {
  const { open, onOpen, onClose } = useDisclosure();

  const [stockFileName, setStockFileName] = useState<string>('');
  const [stockFileSize, setStockFileSize] = useState<number>(0);
  const [stockDragging, setStockDragging] = useState(false);
  const [stockFile, setStockFile] = useState<File | null>(null);
  const [stockField, , stockHelpers] = useField('import-exporter-stock');
  const stockFileInputRef = useRef<HTMLInputElement>(null);

  const [businessStockFileName, setBusinessStockFileName] =
    useState<string>('');
  const [businessStockFileSize, setBusinessStockFileSize] = useState<number>(0);
  const [businessStockDragging, setBusinessStockDragging] = useState(false);
  const [businessStockFile, setBusinessStockFile] = useState<File | null>(null);
  const [businessStockField, , businessStockHelpers] = useField(
    'import-business-stock'
  );
  const businessStockFileInputRef = useRef<HTMLInputElement>(null);

  const { importExporterStock, isLoading: isLoadingStock } =
    useImportExporterStock({
      config: {
        onSuccess: (data) => {
          const { successCount, errorCount, errors } = data.details;
          if (errorCount > 0) {
            toaster.create({
              title: 'Importación completada con errores',
              description: (
                <div>
                  <div>
                    Se importaron {successCount} filas con éxito, pero{' '}
                    {errorCount} fallaron.
                  </div>
                  <div>
                    Detalles:
                    {errors.slice(0, 3).map((err, i) => (
                      <div key={i}>
                        Fila {err.row}: {err.message}
                      </div>
                    ))}
                    {errors.length > 3 && (
                      <div>... y {errors.length - 3} más</div>
                    )}
                  </div>
                </div>
              ),
              type: 'warning',
              duration: 5000,
              closable: true,
            });
          } else {
            toaster.create({
              title: 'Importación exitosa',
              description: `Se importaron todas las filas correctamente (${successCount} en total).`,
              type: 'success',
              duration: 5000,
              closable: true,
            });
          }
          resetStockFile();
        },
        onError: (error) => {
          toaster.create({
            title: 'Error al importar Stock de Exportadora',
            description: serverErrorMessage(error),
            type: 'error',
            duration: 5000,
            closable: true,
          });
        },
      },
    });

  const { importBusinessStock, isLoading: isLoadingBusinessStock } =
    useImportBusinessStock({
      config: {
        onSuccess: (data) => {
          const { successCount, errorCount, errors } = data.details;
          if (errorCount > 0) {
            toaster.create({
              title: 'Importación completada con errores',
              description: (
                <div>
                  <div>
                    Se importaron {successCount} filas con éxito, pero{' '}
                    {errorCount} fallaron.
                  </div>
                  <div>
                    Detalles:
                    {errors.slice(0, 3).map((err, i) => (
                      <div key={i}>
                        Fila {err.row}: {err.message}
                      </div>
                    ))}
                    {errors.length > 3 && (
                      <div>... y {errors.length - 3} más</div>
                    )}
                  </div>
                </div>
              ),
              type: 'warning',
              duration: 5000,
              closable: true,
            });
          } else {
            toaster.create({
              title: 'Importación exitosa',
              description: `Se importaron todas las filas correctamente (${successCount} en total).`,
              type: 'success',
              duration: 5000,
              closable: true,
            });
          }
          resetBusinessStockFile();
        },
        onError: (error) => {
          toaster.create({
            title: 'Error al importar Stock de Fincas',
            description: serverErrorMessage(error),
            type: 'error',
            duration: 5000,
            closable: true,
          });
        },
      },
    });

  const handleStockFileChange = (file: File): void => {
    if (file) {
      setStockFile(file);
      setStockFileName(file.name);
      setStockFileSize(file.size);
      stockHelpers.setValue(file);
      if (stockFileInputRef.current) {
        stockFileInputRef.current.value = '';
      }
    }
  };

  const handleBusinessStockFileChange = (file: File): void => {
    if (file) {
      setBusinessStockFile(file);
      setBusinessStockFileName(file.name);
      setBusinessStockFileSize(file.size);
      businessStockHelpers.setValue(file);
      if (businessStockFileInputRef.current) {
        businessStockFileInputRef.current.value = '';
      }
    }
  };

  const handleStockChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files && event.target.files.length > 0) {
      handleStockFileChange(event.target.files[0]);
    }
  };

  const handleBusinessStockChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files && event.target.files.length > 0) {
      handleBusinessStockFileChange(event.target.files[0]);
    }
  };

  const handleStockDragEnter = (e: React.DragEvent): void => {
    e.preventDefault();
    setStockDragging(true);
  };

  const handleStockDragLeave = (e: React.DragEvent): void => {
    e.preventDefault();
    setStockDragging(false);
  };

  const handleStockDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
    setStockDragging(true);
  };

  const handleStockDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    setStockDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleStockFileChange(file);
  };

  const handleBusinessStockDragEnter = (e: React.DragEvent): void => {
    e.preventDefault();
    setBusinessStockDragging(true);
  };

  const handleBusinessStockDragLeave = (e: React.DragEvent): void => {
    e.preventDefault();
    setBusinessStockDragging(false);
  };

  const handleBusinessStockDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
    setBusinessStockDragging(true);
  };

  const handleBusinessStockDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    setBusinessStockDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleBusinessStockFileChange(file);
  };

  const resetStockFile = (): void => {
    setStockFileName('');
    setStockFileSize(0);
    setStockFile(null);
    stockHelpers.setValue(null);
  };

  const resetBusinessStockFile = (): void => {
    setBusinessStockFileName('');
    setBusinessStockFileSize(0);
    setBusinessStockFile(null);
    businessStockHelpers.setValue(null);
  };

  const handleDownloadTemplate = async (
    type: 'exporter' | 'business'
  ): Promise<void> => {
    try {
      const url =
        type === 'exporter'
          ? '/storage/download/ImportarStockExportadora.xlsm'
          : '/storage/download/ImportarStockFincas.xlsm';
      const { data } = await axios.get(url);
      if (data.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No se recibió una URL válida.');
      }
    } catch (error) {
      toaster.create({
        title: 'Error al descargar la plantilla',
        description: serverErrorMessage(error),
        type: 'error',
        duration: 5000,
        closable: true,
      });
    }
  };

  const handleUpload = (): void => {
    if (stockFile) {
      importExporterStock(stockFile);
    }
    if (businessStockFile) {
      importBusinessStock(businessStockFile);
    }
  };

  const isLoading = isLoadingStock || isLoadingBusinessStock;
  const isDisabled = !stockFile && !businessStockFile;

  return (
    <Box>
      <Button py='8px' px='16px' colorPalette='green' onClick={onOpen}>
        Importar Archivos de Stock
      </Button>

      <Drawer.Root
        open={open}
        placement='end'
        size='md'
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
              <Drawer.Body>
                <Text fontSize={'xl'} fontWeight={'semibold'} mb={2} mt={4}>
                  Importar Stock de Exportadora
                </Text>
                <Text mb={4} fontSize='sm' color='fg.muted'>
                  ¿Necesitas ayuda?{' '}
                  <Link
                    color='green.fg'
                    onClick={() => handleDownloadTemplate('exporter')}
                    cursor='pointer'
                  >
                    Utiliza nuestra guía para Stock de Exportadora.
                  </Link>
                </Text>
                {stockFileName ? (
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
                          Archivo de Stock seleccionado
                        </Text>
                        <Text fontSize='sm' color='fg.muted'>
                          Nombre: <b>{stockFileName}</b>
                        </Text>
                        <Text fontSize='sm' color='fg.muted'>
                          Tamaño: <b>{(stockFileSize / 1024).toFixed(2)} KB</b>
                        </Text>
                      </VStack>
                      <Button
                        size='sm'
                        colorPalette='red'
                        variant='outline'
                        onClick={resetStockFile}
                      >
                        Quitar
                      </Button>
                    </HStack>
                  </Box>
                ) : (
                  <Field.Root id='import-exporter-stock' width='100%'>
                    <Box
                      onDragEnter={handleStockDragEnter}
                      onDragLeave={handleStockDragLeave}
                      onDragOver={handleStockDragOver}
                      onDrop={handleStockDrop}
                      border='2px dashed'
                      borderColor={stockDragging ? 'green.500' : 'gray.300'}
                      borderRadius='md'
                      textAlign='center'
                      bg={stockDragging ? 'green.50' : 'white'}
                      cursor='pointer'
                    >
                      <Input
                        ref={stockFileInputRef}
                        id={stockField.name}
                        type='file'
                        accept='.csv'
                        display='none'
                        onChange={handleStockChange}
                      />
                      <Field.Label>
                        {isLoading ? (
                          <Spinner />
                        ) : (
                          <Image
                            src={'/uploaded.png'}
                            alt='Subida de archivo'
                            maxW='150px'
                            pt={8}
                            my={2}
                            mx='auto'
                          />
                        )}
                        <Text
                          textAlign='center'
                          p={4}
                          color={stockDragging ? 'green.500' : 'gray.300'}
                        >
                          {stockDragging
                            ? 'Suelta aquí...'
                            : 'Arrastra y suelta un archivo aquí, o haz clic para seleccionar uno'}
                        </Text>
                      </Field.Label>
                    </Box>
                  </Field.Root>
                )}

                <Text fontSize={'xl'} fontWeight={'semibold'} mb={2} mt={4}>
                  Importar Stock de Fincas
                </Text>
                <Text mb={4} fontSize='sm' color='fg.muted'>
                  ¿Necesitas ayuda?{' '}
                  <Link
                    color='green.fg'
                    onClick={() => handleDownloadTemplate('business')}
                    cursor='pointer'
                  >
                    Utiliza nuestra guía para Stock de Fincas.
                  </Link>
                </Text>
                {businessStockFileName ? (
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
                          Archivo de Stock de Fincas seleccionado
                        </Text>
                        <Text fontSize='sm' color='fg.muted'>
                          Nombre: <b>{businessStockFileName}</b>
                        </Text>
                        <Text fontSize='sm' color='fg.muted'>
                          Tamaño:{' '}
                          <b>{(businessStockFileSize / 1024).toFixed(2)} KB</b>
                        </Text>
                      </VStack>
                      <Button
                        size='sm'
                        colorPalette='red'
                        variant='outline'
                        onClick={resetBusinessStockFile}
                      >
                        Quitar
                      </Button>
                    </HStack>
                  </Box>
                ) : (
                  <Field.Root id='import-business-stock' width='100%'>
                    <Box
                      onDragEnter={handleBusinessStockDragEnter}
                      onDragLeave={handleBusinessStockDragLeave}
                      onDragOver={handleBusinessStockDragOver}
                      onDrop={handleBusinessStockDrop}
                      border='2px dashed'
                      borderColor={
                        businessStockDragging ? 'green.500' : 'gray.300'
                      }
                      borderRadius='md'
                      textAlign='center'
                      bg={businessStockDragging ? 'green.50' : 'white'}
                      cursor='pointer'
                    >
                      <Input
                        ref={businessStockFileInputRef}
                        id={businessStockField.name}
                        type='file'
                        accept='.csv'
                        display='none'
                        onChange={handleBusinessStockChange}
                      />
                      <Field.Label>
                        {isLoading ? (
                          <Spinner />
                        ) : (
                          <Image
                            src={'/uploaded.png'}
                            alt='Subida de archivo'
                            maxW='150px'
                            pt={8}
                            my={2}
                            mx='auto'
                          />
                        )}
                        <Text
                          textAlign='center'
                          p={4}
                          color={
                            businessStockDragging ? 'green.500' : 'gray.300'
                          }
                        >
                          {businessStockDragging
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
                  onClick={handleUpload}
                  disabled={isDisabled}
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

export default ImportExporterStockDrawer;

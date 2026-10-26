import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  useDisclosure,
  Text,
  FormControl,
  FormLabel,
  Spinner,
  Image,
  VStack,
  HStack,
  useToast,
  Link,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { useRef, useState } from 'react';
import { useImportBusinessStock } from '../../hooks/winery/useImportBusinessStock'; // Nuevo hook
import { useImportExporterStock } from '../../hooks/winery/useImportExporterStock';
import axios from '../../lib/axios';
import { serverErrorMessage } from '../../utils/serverErrorMessage';

const ImportExporterStockDrawer: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

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
            toast({
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
              status: 'warning',
              duration: 5000,
              isClosable: true,
            });
          } else {
            toast({
              title: 'Importación exitosa',
              description: `Se importaron todas las filas correctamente (${successCount} en total).`,
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
          }
          resetStockFile();
        },
        onError: (error) => {
          toast({
            title: 'Error al importar Stock de Exportadora',
            description: serverErrorMessage(error),
            status: 'error',
            duration: 5000,
            isClosable: true,
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
            toast({
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
              status: 'warning',
              duration: 5000,
              isClosable: true,
            });
          } else {
            toast({
              title: 'Importación exitosa',
              description: `Se importaron todas las filas correctamente (${successCount} en total).`,
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
          }
          resetBusinessStockFile();
        },
        onError: (error) => {
          toast({
            title: 'Error al importar Stock de Fincas',
            description: serverErrorMessage(error),
            status: 'error',
            duration: 5000,
            isClosable: true,
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
      toast({
        title: 'Error al descargar la plantilla',
        description: serverErrorMessage(error),
        status: 'error',
        duration: 5000,
        isClosable: true,
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
      <Button py='8px' px='16px' colorScheme='teal' onClick={onOpen}>
        Importar Archivos de Stock
      </Button>

      <Drawer isOpen={isOpen} placement='right' onClose={onClose} size='md'>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <Text fontSize={'xl'} fontWeight={'semibold'} mb={2} mt={4}>
              Importar Stock de Exportadora
            </Text>
            <Text mb={4} fontSize='sm' color='gray.600'>
              ¿Necesitas ayuda?{' '}
              <Link
                color='teal'
                onClick={() => handleDownloadTemplate('exporter')}
                cursor='pointer'
              >
                Utiliza nuestra guía para Stock de Exportadora.
              </Link>
            </Text>
            {stockFileName ? (
              <Box
                border='1px solid'
                borderColor='gray.200'
                borderRadius='md'
                p={4}
                bg='teal.50'
                shadow='md'
              >
                <HStack justify='space-between'>
                  <VStack align='start' spacing={1}>
                    <Text fontWeight='bold' fontSize='lg'>
                      Archivo de Stock seleccionado
                    </Text>
                    <Text fontSize='sm' color='gray.600'>
                      Nombre: <b>{stockFileName}</b>
                    </Text>
                    <Text fontSize='sm' color='gray.600'>
                      Tamaño: <b>{(stockFileSize / 1024).toFixed(2)} KB</b>
                    </Text>
                  </VStack>
                  <Button
                    size='sm'
                    colorScheme='red'
                    variant='outline'
                    onClick={resetStockFile}
                  >
                    Quitar
                  </Button>
                </HStack>
              </Box>
            ) : (
              <FormControl id='import-exporter-stock' width='100%'>
                <Box
                  onDragEnter={handleStockDragEnter}
                  onDragLeave={handleStockDragLeave}
                  onDragOver={handleStockDragOver}
                  onDrop={handleStockDrop}
                  border='2px dashed'
                  borderColor={stockDragging ? 'teal.500' : 'gray.300'}
                  borderRadius='md'
                  textAlign='center'
                  bg={stockDragging ? 'teal.50' : 'white'}
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
                  <FormLabel>
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
                      color={stockDragging ? 'teal.500' : 'gray.300'}
                    >
                      {stockDragging
                        ? 'Suelta aquí...'
                        : 'Arrastra y suelta un archivo aquí, o haz clic para seleccionar uno'}
                    </Text>
                  </FormLabel>
                </Box>
              </FormControl>
            )}

            <Text fontSize={'xl'} fontWeight={'semibold'} mb={2} mt={4}>
              Importar Stock de Fincas
            </Text>
            <Text mb={4} fontSize='sm' color='gray.600'>
              ¿Necesitas ayuda?{' '}
              <Link
                color='teal'
                onClick={() => handleDownloadTemplate('business')}
                cursor='pointer'
              >
                Utiliza nuestra guía para Stock de Fincas.
              </Link>
            </Text>
            {businessStockFileName ? (
              <Box
                border='1px solid'
                borderColor='gray.200'
                borderRadius='md'
                p={4}
                bg='teal.50'
                shadow='md'
              >
                <HStack justify='space-between'>
                  <VStack align='start' spacing={1}>
                    <Text fontWeight='bold' fontSize='lg'>
                      Archivo de Stock de Fincas seleccionado
                    </Text>
                    <Text fontSize='sm' color='gray.600'>
                      Nombre: <b>{businessStockFileName}</b>
                    </Text>
                    <Text fontSize='sm' color='gray.600'>
                      Tamaño:{' '}
                      <b>{(businessStockFileSize / 1024).toFixed(2)} KB</b>
                    </Text>
                  </VStack>
                  <Button
                    size='sm'
                    colorScheme='red'
                    variant='outline'
                    onClick={resetBusinessStockFile}
                  >
                    Quitar
                  </Button>
                </HStack>
              </Box>
            ) : (
              <FormControl id='import-business-stock' width='100%'>
                <Box
                  onDragEnter={handleBusinessStockDragEnter}
                  onDragLeave={handleBusinessStockDragLeave}
                  onDragOver={handleBusinessStockDragOver}
                  onDrop={handleBusinessStockDrop}
                  border='2px dashed'
                  borderColor={businessStockDragging ? 'teal.500' : 'gray.300'}
                  borderRadius='md'
                  textAlign='center'
                  bg={businessStockDragging ? 'teal.50' : 'white'}
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
                  <FormLabel>
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
                      color={businessStockDragging ? 'teal.500' : 'gray.300'}
                    >
                      {businessStockDragging
                        ? 'Suelta aquí...'
                        : 'Arrastra y suelta un archivo aquí, o haz clic para seleccionar uno'}
                    </Text>
                  </FormLabel>
                </Box>
              </FormControl>
            )}
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              py='8px'
              px='16px'
              colorScheme='teal'
              onClick={handleUpload}
              isDisabled={isDisabled}
              isLoading={isLoading}
            >
              Subir
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default ImportExporterStockDrawer;

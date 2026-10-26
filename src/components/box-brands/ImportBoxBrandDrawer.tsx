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
import { useImportBoxBrandMaterials } from '../../hooks/box-brand/materials/uploadBoxBrandMaterials';
import { useImportBoxBrands } from '../../hooks/box-brand/uploadBoxBrands';
import axios from '../../lib/axios';
import { serverErrorMessage } from '../../utils/serverErrorMessage';

const ImportFilesDrawer: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [boxBrandFileName, setBoxBrandFileName] = useState<string>('');
  const [boxBrandFileSize, setBoxBrandFileSize] = useState<number>(0);
  const [boxBrandDragging, setBoxBrandDragging] = useState(false);
  const [boxBrandFile, setBoxBrandFile] = useState<File | null>(null);
  const [boxBrandField, , boxBrandHelpers] = useField('import-boxBrand');
  const boxBrandFileInputRef = useRef<HTMLInputElement>(null);

  const { importBoxBrands, isLoading: isLoadingBoxBrand } = useImportBoxBrands({
    config: {
      onSuccess: (data) => {
        const { successCount, errorCount, errors } = data.details;
        if (errorCount > 0) {
          toast({
            title: 'Importación completada con errores',
            description: (
              <div>
                <div>Se importaron {successCount} filas con éxito, pero {errorCount} fallaron.</div>
                <div>
                  Detalles:
                  {errors.slice(0, 3).map((err, i) => (
                    <div key={i}>
                      Fila {err.row}: {err.message}
                    </div>
                  ))}
                  {errors.length > 3 && <div>... y {errors.length - 3} más</div>}
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
        resetBoxBrandFile();
      },
      onError: (error) => {
        toast({
          title: 'Error al importar Box Brand',
          description: serverErrorMessage(error),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      },
    },
  });

  const handleBoxBrandFileChange = (file: File): void => {
    if (file) {
      setBoxBrandFile(file);
      setBoxBrandFileName(file.name);
      setBoxBrandFileSize(file.size);
      boxBrandHelpers.setValue(file);
      if (boxBrandFileInputRef.current) {
        boxBrandFileInputRef.current.value = '';
      }
    }
  };

  const handleBoxBrandChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length > 0) {
      handleBoxBrandFileChange(event.target.files[0]);
    }
  };

  const handleBoxBrandDragEnter = (e: React.DragEvent): void => {
    e.preventDefault();
    setBoxBrandDragging(true);
  };

  const handleBoxBrandDragLeave = (e: React.DragEvent): void => {
    e.preventDefault();
    setBoxBrandDragging(false);
  };

  const handleBoxBrandDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
    setBoxBrandDragging(true);
  };

  const handleBoxBrandDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    setBoxBrandDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleBoxBrandFileChange(file);
  };

  const resetBoxBrandFile = (): void => {
    setBoxBrandFileName('');
    setBoxBrandFileSize(0);
    setBoxBrandFile(null);
    boxBrandHelpers.setValue(null);
  };

  const [materialFileName, setMaterialFileName] = useState<string>('');
  const [materialFileSize, setMaterialFileSize] = useState<number>(0);
  const [materialDragging, setMaterialDragging] = useState(false);
  const [materialFile, setMaterialFile] = useState<File | null>(null);
  const [materialField, , materialHelpers] = useField('import-material');
  const materialFileInputRef = useRef<HTMLInputElement>(null);

  const { importBoxBrandMaterials, isLoading: isLoadingMaterials } = useImportBoxBrandMaterials({
    config: {
      onSuccess: (data) => {
        const { successCount, errorCount, errors } = data.details;
        if (errorCount > 0) {
          toast({
            title: 'Importación de materiales completada con errores',
            description: (
              <div>
                <div>Se importaron {successCount} filas con éxito, pero {errorCount} fallaron.</div>
                <div>
                  Detalles:
                  {errors.slice(0, 3).map((err, i) => (
                    <div key={i}>
                      Fila {err.row}: {err.message}
                    </div>
                  ))}
                  {errors.length > 3 && <div>... y {errors.length - 3} más</div>}
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
        resetMaterialFile();
      },
      onError: (error) => {
        toast({
          title: 'Error al importar Materiales',
          description: serverErrorMessage(error),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      },
    },
  });

  const handleMaterialFileChange = (file: File): void => {
    if (file) {
      setMaterialFile(file);
      setMaterialFileName(file.name);
      setMaterialFileSize(file.size);
      materialHelpers.setValue(file);
      if (materialFileInputRef.current) {
        materialFileInputRef.current.value = '';
      }
    }
  };

  const handleMaterialChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length > 0) {
      handleMaterialFileChange(event.target.files[0]);
    }
  };

  const handleMaterialDragEnter = (e: React.DragEvent): void => {
    e.preventDefault();
    setMaterialDragging(true);
  };

  const handleMaterialDragLeave = (e: React.DragEvent): void => {
    e.preventDefault();
    setMaterialDragging(false);
  };

  const handleMaterialDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
    setMaterialDragging(true);
  };

  const handleMaterialDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    setMaterialDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleMaterialFileChange(file);
  };

  const resetMaterialFile = (): void => {
    setMaterialFileName('');
    setMaterialFileSize(0);
    setMaterialFile(null);
    materialHelpers.setValue(null);
  };

  const handleDownloadTemplate = async (type: 'boxBrand' | 'material'): Promise<void> => {
    try {
      const url =
        type === 'boxBrand'
          ? '/storage/download/ImportarMarcasDeCaja.xlsm'
          : '/storage/download/ImportarMateriales.xlsm';
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
    if (boxBrandFile) {
      importBoxBrands(boxBrandFile);
    }
    if (materialFile) {
      importBoxBrandMaterials(materialFile);
    }
  };

  const isLoading = isLoadingBoxBrand || isLoadingMaterials;
  const isDisabled = !boxBrandFile && !materialFile;

  return (
    <Box>
      <Button py="8px" px="16px" colorScheme="teal" onClick={onOpen}>
        Importar Archivos
      </Button>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <Text fontSize={"xl"} fontWeight={"semibold"} mb={2} mt={4}>Importar Marcas de Caja</Text>
            <Text mb={4} fontSize="sm" color="gray.600">
              ¿Necesitas ayuda?{' '}
              <Link
                color="teal"
                onClick={() => handleDownloadTemplate('boxBrand')}
                cursor="pointer"
              >
                Utiliza nuestra guía para Marcas de Caja.
              </Link>
            </Text>
            {boxBrandFileName ? (
              <Box
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                p={4}
                bg="teal.50"
                shadow="md"
              >
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" fontSize="lg">
                      Archivo de Marcas seleccionado
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Nombre: <b>{boxBrandFileName}</b>
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Tamaño: <b>{(boxBrandFileSize / 1024).toFixed(2)} KB</b>
                    </Text>
                  </VStack>
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    onClick={resetBoxBrandFile}
                  >
                    Quitar
                  </Button>
                </HStack>
              </Box>
            ) : (
              <FormControl id="import-boxBrand" width="100%">
                <Box
                  onDragEnter={handleBoxBrandDragEnter}
                  onDragLeave={handleBoxBrandDragLeave}
                  onDragOver={handleBoxBrandDragOver}
                  onDrop={handleBoxBrandDrop}
                  border="2px dashed"
                  borderColor={boxBrandDragging ? 'teal.500' : 'gray.300'}
                  borderRadius="md"
                  textAlign="center"
                  bg={boxBrandDragging ? 'teal.50' : 'white'}
                  cursor="pointer"
                >
                  <Input
                    ref={boxBrandFileInputRef}
                    id={boxBrandField.name}
                    type="file"
                    accept=".csv"
                    display="none"
                    onChange={handleBoxBrandChange}
                  />
                  <FormLabel>
                    {isLoadingBoxBrand ? (
                      <Spinner />
                    ) : (
                      <Image
                        src={'/uploaded.png'}
                        alt="Subida de archivo"
                        maxW="150px"
                        pt={8}
                        my={2}
                        mx="auto"
                      />
                    )}
                    <Text textAlign="center" p={4} color={boxBrandDragging ? 'teal.500' : 'gray.300'}>
                      {boxBrandDragging
                        ? 'Suelta aquí...'
                        : 'Arrastra y suelta un archivo aquí, o haz clic para seleccionar uno'}
                    </Text>
                  </FormLabel>
                </Box>
              </FormControl>
            )}
            <Text fontSize={"xl"} fontWeight={"semibold"} mb={2} mt={4}>Importar Materiales</Text>
            <Text mb={4} fontSize="sm" color="gray.600">
              ¿Necesitas ayuda?{' '}
              <Link
                color="teal"
                onClick={() => handleDownloadTemplate('material')}
                cursor="pointer"
              >
                Utiliza nuestra guía para Materiales.
              </Link>
            </Text>
            {materialFileName ? (
              <Box
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                p={4}
                bg="teal.50"
                shadow="md"
              >
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" fontSize="lg">
                      Archivo de Materiales seleccionado
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Nombre: <b>{materialFileName}</b>
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Tamaño: <b>{(materialFileSize / 1024).toFixed(2)} KB</b>
                    </Text>
                  </VStack>
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    onClick={resetMaterialFile}
                  >
                    Quitar
                  </Button>
                </HStack>
              </Box>
            ) : (
              <FormControl id="import-material" width="100%">
                <Box
                  onDragEnter={handleMaterialDragEnter}
                  onDragLeave={handleMaterialDragLeave}
                  onDragOver={handleMaterialDragOver}
                  onDrop={handleMaterialDrop}
                  border="2px dashed"
                  borderColor={materialDragging ? 'teal.500' : 'gray.300'}
                  borderRadius="md"
                  textAlign="center"
                  bg={materialDragging ? 'teal.50' : 'white'}
                  cursor="pointer"
                >
                  <Input
                    ref={materialFileInputRef}
                    id={materialField.name}
                    type="file"
                    accept=".csv"
                    display="none"
                    onChange={handleMaterialChange}
                  />
                  <FormLabel>
                    {isLoadingMaterials ? (
                      <Spinner />
                    ) : (
                      <Image
                        src={'/uploaded.png'}
                        alt="Subida de archivo"
                        maxW="150px"
                        pt={8}
                        my={2}
                        mx="auto"
                      />
                    )}
                    <Text textAlign="center" p={4} color={materialDragging ? 'teal.500' : 'gray.300'}>
                      {materialDragging
                        ? 'Suelta aquí...'
                        : 'Arrastra y suelta un archivo aquí, o haz clic para seleccionar uno'}
                    </Text>
                  </FormLabel>
                </Box>
              </FormControl>
            )}
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              py="8px"
              px="16px"
              colorScheme="teal"
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

export default ImportFilesDrawer;
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
import { useImportBoxBrandMaterials } from '../../hooks/box-brand/materials/uploadBoxBrandMaterials';
import { useImportBoxBrands } from '../../hooks/box-brand/uploadBoxBrands';
import axios from '../../lib/axios';
import { serverErrorMessage } from '../../utils/serverErrorMessage';

const ImportFilesDrawer: React.FC = () => {
  const { open, onOpen, onClose } = useDisclosure();

  const [boxBrandFileName, setBoxBrandFileName] = useState<string>('');
  const [boxBrandFileSize, setBoxBrandFileSize] = useState<number>(0);
  const [boxBrandDragging, setBoxBrandDragging] = useState(false);
  const [boxBrandFile, setBoxBrandFile] = useState<File | null>(null);
  const [boxBrandField, , boxBrandHelpers] = useField('import-boxBrand');
  const boxBrandFileInputRef = useRef<HTMLInputElement>(null);

  const { importBoxBrands, isPending: isLoadingBoxBrand } = useImportBoxBrands({
    config: {
      onSuccess: (data) => {
        const { successCount, errorCount, errors } = data.details;
        if (errorCount > 0) {
          toaster.create({
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
        resetBoxBrandFile();
      },
      onError: (error) => {
        toaster.create({
          title: 'Error al importar Box Brand',
          description: serverErrorMessage(error),
          type: 'error',
          duration: 5000,
          closable: true,
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

  const { importBoxBrandMaterials, isPending: isLoadingMaterials } = useImportBoxBrandMaterials({
    config: {
      onSuccess: (data) => {
        const { successCount, errorCount, errors } = data.details;
        if (errorCount > 0) {
          toaster.create({
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
        resetMaterialFile();
      },
      onError: (error) => {
        toaster.create({
          title: 'Error al importar materiales',
          description: serverErrorMessage(error),
          type: 'error',
          duration: 5000,
          closable: true,
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
      <Button py="8px" px="16px" colorPalette='green' onClick={onOpen}>
        Importar Archivos
      </Button>

      <Drawer.Root open={open} placement='end' size='md' onOpenChange={e => {
        if (!e.open) {
          onClose();
        }
      }}>
        <Portal>

          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.CloseTrigger />
              <Drawer.Body>
                <Text fontSize={"xl"} fontWeight={"semibold"} mb={2} mt={4}>Importar marcas de caja</Text>
                <Text mb={4} fontSize="sm" color="fg.muted">
                  ¿Necesitas ayuda?{' '}
                  <Link
                    color='green.fg'
                    onClick={() => handleDownloadTemplate('boxBrand')}
                    cursor="pointer"
                  >
                    Utiliza nuestra guía para Marcas de Caja.
                  </Link>
                </Text>
                {boxBrandFileName ? (
                  <Box
                    borderWidth='1px'
                    borderColor="border"
                    borderRadius="md"
                    p={4}
                    bg='green.subtle'
                    shadow="md"
                  >
                    <HStack justify="space-between">
                      <VStack align="start" gap={1}>
                        <Text fontWeight="bold" fontSize="lg">
                          Archivo de Marcas seleccionado
                        </Text>
                        <Text fontSize="sm" color="fg.muted">
                          Nombre: <b>{boxBrandFileName}</b>
                        </Text>
                        <Text fontSize="sm" color="fg.muted">
                          Tamaño: <b>{(boxBrandFileSize / 1024).toFixed(2)} KB</b>
                        </Text>
                      </VStack>
                      <Button
                        size="sm"
                        colorPalette="red"
                        variant="outline"
                        onClick={resetBoxBrandFile}
                      >
                        Quitar
                      </Button>
                    </HStack>
                  </Box>
                ) : (
                  <Field.Root id="import-boxBrand" width="100%">
                    <Box
                      onDragEnter={handleBoxBrandDragEnter}
                      onDragLeave={handleBoxBrandDragLeave}
                      onDragOver={handleBoxBrandDragOver}
                      onDrop={handleBoxBrandDrop}
                      border="2px dashed"
                      borderColor={boxBrandDragging ? 'green.500' : 'gray.300'}
                      borderRadius="md"
                      textAlign="center"
                      bg={boxBrandDragging ? 'green.50' : 'white'}
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
                      <Field.Label>
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
                        <Text textAlign="center" p={4} color={boxBrandDragging ? 'green.500' : 'gray.300'}>
                          {boxBrandDragging
                            ? 'Suelta aquí...'
                            : 'Arrastra y suelta un archivo aquí, o haz clic para seleccionar uno'}
                        </Text>
                      </Field.Label>
                    </Box>
                  </Field.Root>
                )}
                <Text fontSize={"xl"} fontWeight={"semibold"} mb={2} mt={4}>Importar materiales</Text>
                <Text mb={4} fontSize="sm" color="fg.muted">
                  ¿Necesitas ayuda?{' '}
                  <Link
                    color='green.fg'
                    onClick={() => handleDownloadTemplate('material')}
                    cursor="pointer"
                  >
                    Utiliza nuestra guía para Materiales.
                  </Link>
                </Text>
                {materialFileName ? (
                  <Box
                    borderWidth='1px'
                    borderColor="border"
                    borderRadius="md"
                    p={4}
                    bg='green.subtle'
                    shadow="md"
                  >
                    <HStack justify="space-between">
                      <VStack align="start" gap={1}>
                        <Text fontWeight="bold" fontSize="lg">
                          Archivo de Materiales seleccionado
                        </Text>
                        <Text fontSize="sm" color="fg.muted">
                          Nombre: <b>{materialFileName}</b>
                        </Text>
                        <Text fontSize="sm" color="fg.muted">
                          Tamaño: <b>{(materialFileSize / 1024).toFixed(2)} KB</b>
                        </Text>
                      </VStack>
                      <Button
                        size="sm"
                        colorPalette="red"
                        variant="outline"
                        onClick={resetMaterialFile}
                      >
                        Quitar
                      </Button>
                    </HStack>
                  </Box>
                ) : (
                  <Field.Root id="import-material" width="100%">
                    <Box
                      onDragEnter={handleMaterialDragEnter}
                      onDragLeave={handleMaterialDragLeave}
                      onDragOver={handleMaterialDragOver}
                      onDrop={handleMaterialDrop}
                      border="2px dashed"
                      borderColor={materialDragging ? 'green.500' : 'gray.300'}
                      borderRadius="md"
                      textAlign="center"
                      bg={materialDragging ? 'green.50' : 'white'}
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
                      <Field.Label>
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
                        <Text textAlign="center" p={4} color={materialDragging ? 'green.500' : 'gray.300'}>
                          {materialDragging
                            ? 'Suelta aquí...'
                            : 'Arrastra y suelta un archivo aquí, o haz clic para seleccionar uno'}
                        </Text>
                      </Field.Label>
                    </Box>
                  </Field.Root>
                )}
              </Drawer.Body>

              <Drawer.Footer>
                <Button variant="outline" mr={3} onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  py="8px"
                  px="16px"
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

export default ImportFilesDrawer;
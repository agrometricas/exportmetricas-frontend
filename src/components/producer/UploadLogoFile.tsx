import {
  Box,
  Input,
  Image,
  Spinner,
  Text,
  Flex,
  Field,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { useEffect, useRef, useState } from 'react';

interface UploadLogoFileProps {
  name: string;
}

const UploadLogoFile: React.FC<UploadLogoFileProps> = ({ name }) => {
  const [field, meta, helpers] = useField(name);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!field.value) {
      setImageUrl(null);
      setImageInfo(null);
      setLoading(false);
      setDragging(false);
    }
  }, [field.value]);

  const handleDragEnter = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File): void => {
    if (file) {
      setLoading(true);
      helpers.setValue(file);
      const reader = new FileReader();
      reader.onloadend = (): void => {
        setImageUrl(reader.result as string);
        const img = new window.Image();
        img.onload = (): void => {
          setImageInfo({ width: img.width, height: img.height });
          setLoading(false);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Field.Root id={name} invalid={!!meta.error && meta.touched} width={'100%'}>
      <Box
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        border='2px dashed'
        borderColor={dragging ? 'green.500' : 'gray.300'}
        borderRadius='md'
        p={0}
        m={0}
        textAlign='center'
        bg={dragging ? 'green.50' : 'white'}
      >
        <Input
          ref={fileInputRef}
          id={field.name}
          type='file'
          accept='image/*'
          display={'none'}
          onChange={handleChange}
        />
        <Field.Label m={0} id={field.name}>
          {loading ? (
            <Spinner />
          ) : imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt='Logo subido'
                maxH='200px'
                my={2}
                mx={'auto'}
              />
              {imageInfo && !!meta.value?.size && (
                <Flex mt={2} textAlign='left' gap={2} ml={'15px'}>
                  <Text>Número de archivos: 1,</Text>
                  <Text>Tamaño: {(meta.value.size / 1024).toFixed(2)} KB,</Text>
                  <Text>
                    Dimensiones: {imageInfo.width}x{imageInfo.height} px
                  </Text>
                </Flex>
              )}
            </>
          ) : (
            <Image
              src={'/uploaded.png'}
              alt='imagen de subida'
              maxH='100px'
              pt={'20px'}
              mx={'auto'}
            />
          )}
          <Text p={4} color={dragging ? 'green.500' : 'gray.300'}>
            {dragging
              ? 'Suelta aquí...'
              : 'Arrastra y suelta un archivo aquí, o haz clic para seleccionar uno'}
          </Text>
        </Field.Label>
      </Box>
      {meta.error && meta.touched && (
        <Field.ErrorText mt='8px' mb='16px'>
          {meta.error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default UploadLogoFile;

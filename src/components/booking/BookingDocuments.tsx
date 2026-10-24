import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { Form, Formik, FormikHelpers, useField } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import {
  useBookingDocuments,
  useDeleteBookingDocument,
  useDocumentTypes,
  useUploadBookingDocument,
} from '../../hooks/booking/bookingDocuments';
import { BookingContainer } from '../../types/booking';
import {
  BookingDocument,
  DocumentTypeOption,
} from '../../types/bookingDocument';
import {
  bookingDocumentBody,
  DocumentValues,
  EMPTY_DOCUMENT,
} from '../../utils/bookingDocumentBody';
import { formatDayMonthYear } from '../../utils/dayMonthYear';
import {
  DOCUMENT_STATUS_COLOR,
  documentStatusText,
} from '../../utils/documentStatus';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import InputFieldDayDate, {
  INVALID_DAY_DATE,
} from '../ui/form/InputFieldDayDate';
import InputFieldPlain from '../ui/form/InputFieldPlain';
import InputFieldSelector from '../ui/form/InputFieldSelector';

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const AFFECTED_QUERIES = ['bookingDocuments', 'exports', 'export'];

function documentSchema(types: DocumentTypeOption[]): Yup.AnyObjectSchema {
  const option = (type: string): DocumentTypeOption | undefined =>
    types.find((candidate) => candidate.type === type);
  const day = Yup.string().test(
    'complete-day',
    'Escribe la fecha completa: DD/MM/AAAA',
    (value) => value !== INVALID_DAY_DATE
  );
  return Yup.object({
    type: Yup.string().required('Elige el tipo de documento'),
    number: Yup.string()
      .trim()
      .required('Escribe el número del documento')
      .max(60, 'Hasta 60 caracteres'),
    containerId: Yup.string().when('type', {
      is: (type: string) => option(type)?.needsContainer,
      then: (schema) => schema.required('Elige el contenedor'),
    }),
    issuedAt: day,
    expiresAt: day.when('type', {
      is: (type: string) => option(type)?.needsExpiry,
      then: (schema) => schema.required('Escribe la fecha de vencimiento'),
    }),
    file: Yup.mixed<File>()
      .required('Adjunta el archivo')
      .test(
        'file-type',
        'El archivo debe ser PDF, JPG o PNG',
        (file) => !file || FILE_TYPES.includes(file.type)
      )
      .test(
        'file-size',
        'El archivo no puede pasar de 10 MB',
        (file) => !file || file.size <= MAX_FILE_BYTES
      ),
  });
}

function FileField({ resetKey }: { resetKey: number }): React.JSX.Element {
  const [, meta, helpers] = useField<File | null>('file');
  return (
    <FormControl isInvalid={!!meta.error && meta.touched}>
      <FormLabel fontSize='sm' mb='8px'>
        Archivo (PDF, JPG o PNG, hasta 10 MB)
      </FormLabel>
      <Input
        key={resetKey}
        type='file'
        accept='application/pdf,image/jpeg,image/png'
        pt='5px'
        onChange={(event) => {
          helpers.setTouched(true, false);
          helpers.setValue(event.target.files?.[0] ?? null);
        }}
      />
      {meta.error && meta.touched && (
        <FormErrorMessage mt='8px'>{meta.error}</FormErrorMessage>
      )}
    </FormControl>
  );
}

function DeleteDocumentButton({
  bookingId,
  document,
}: {
  bookingId: number;
  document: BookingDocument;
}): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const queryClient = useQueryClient();
  const { mutate: remove, isLoading } = useDeleteBookingDocument();

  const confirm = (): void =>
    remove(
      { bookingId, documentId: document.id },
      {
        onError: (error) => {
          toast({
            title: 'No se eliminó el documento',
            description: serverErrorMessage(error),
            status: 'error',
            duration: 6000,
            isClosable: true,
          });
        },
        onSuccess: () => {
          AFFECTED_QUERIES.forEach((key) => queryClient.invalidateQueries(key));
          setIsOpen(false);
        },
      }
    );

  return (
    <>
      <Button
        size='xs'
        variant='ghost'
        colorScheme='red'
        onClick={() => setIsOpen(true)}
      >
        Eliminar
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Eliminar {document.typeLabel} {document.number}
            </AlertDialogHeader>
            <AlertDialogBody>
              Se borra el documento y su archivo. No se puede deshacer.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button
                colorScheme='red'
                ml={3}
                isLoading={isLoading}
                onClick={confirm}
              >
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default function BookingDocuments({
  bookingId,
  containers,
}: {
  bookingId: number;
  containers: BookingContainer[];
}): React.JSX.Element {
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const [fileKey, setFileKey] = useState(0);
  const { data: documentsData } = useBookingDocuments(bookingId);
  const { data: typesData } = useDocumentTypes();
  const { mutate: upload, isLoading } = useUploadBookingDocument();
  const documents = (documentsData ?? []) as BookingDocument[];
  const types = (typesData ?? []) as DocumentTypeOption[];

  const onSubmit = (
    values: DocumentValues,
    helpers: FormikHelpers<DocumentValues>
  ): void =>
    upload(
      { bookingId, body: bookingDocumentBody(values) },
      {
        onError: (error) => {
          if (isAxiosError(error) && error.response?.status === 401) {
            router.push('/api/auth/signout');
            return;
          }
          toast({
            title: 'No se subió el documento',
            description: serverErrorMessage(error),
            status: 'error',
            duration: 6000,
            isClosable: true,
          });
        },
        onSuccess: ({ data }) => {
          toast({
            title: `${data.typeLabel} ${data.number} subido`,
            description: documentStatusText(data.status, data.daysLeft),
            status: 'success',
            duration: 4000,
            isClosable: true,
          });
          AFFECTED_QUERIES.forEach((key) => queryClient.invalidateQueries(key));
          helpers.resetForm();
          setFileKey((key) => key + 1);
        },
      }
    );

  return (
    <Flex direction='column' gap={4}>
      <Box>
        <Heading size='md'>Documentos del embarque</Heading>
        <Text fontSize='sm' color='gray.600' mt={1}>
          BL, fitosanitario, certificado de origen e inspección de cada
          contenedor. Valen para todas las exportaciones del booking. El sistema
          avisa por correo a la exportadora lo que vence en los próximos 15
          días.
        </Text>
      </Box>

      {documents.length > 0 ? (
        <TableContainer
          border='1px solid'
          borderColor={borderColor}
          borderRadius='md'
          whiteSpace='normal'
        >
          <Table size='sm'>
            <Thead>
              <Tr>
                <Th>Documento</Th>
                <Th>Contenedor</Th>
                <Th>Emisión</Th>
                <Th>Vencimiento</Th>
                <Th>Estado</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {documents.map((document) => (
                <Tr key={document.id}>
                  <Td>
                    <Text fontWeight='semibold'>{document.typeLabel}</Text>
                    <Link
                      href={document.fileUrl}
                      isExternal
                      color='green.600'
                      fontSize='sm'
                    >
                      {document.number} · {document.fileName}
                    </Link>
                  </Td>
                  <Td>{document.containerNumber ?? '—'}</Td>
                  <Td>{formatDayMonthYear(document.issuedAt) || '—'}</Td>
                  <Td>{formatDayMonthYear(document.expiresAt) || '—'}</Td>
                  <Td>
                    <Badge colorScheme={DOCUMENT_STATUS_COLOR[document.status]}>
                      {documentStatusText(document.status, document.daysLeft)}
                    </Badge>
                  </Td>
                  <Td textAlign='right'>
                    <DeleteDocumentButton
                      bookingId={bookingId}
                      document={document}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Text fontSize='sm' color='gray.600'>
          Todavía no hay documentos en este booking.
        </Text>
      )}

      <Formik
        initialValues={EMPTY_DOCUMENT}
        validationSchema={documentSchema(types)}
        onSubmit={onSubmit}
      >
        {({ values }) => {
          const selected = types.find((option) => option.type === values.type);
          return (
            <Form>
              <Box
                border='1px solid'
                borderColor={borderColor}
                borderRadius='md'
                p={4}
              >
                <Text fontWeight='semibold' mb={3}>
                  Subir un documento
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <InputFieldSelector
                    name='type'
                    label='Tipo'
                    placeholder='Seleccione el tipo'
                    options={types.map(({ type, label }) => ({
                      id: type,
                      name: label,
                    }))}
                  />
                  <InputFieldPlain name='number' label='Número' />
                  <InputFieldSelector
                    name='containerId'
                    label={
                      selected?.needsContainer
                        ? 'Contenedor'
                        : 'Contenedor (opcional)'
                    }
                    placeholder='Todo el booking'
                    options={containers.map(({ id, number }) => ({
                      id: String(id),
                      name: number,
                    }))}
                  />
                  <InputFieldDayDate
                    name='issuedAt'
                    label='Emisión (opcional)'
                  />
                  <InputFieldDayDate
                    name='expiresAt'
                    label={
                      selected?.needsExpiry
                        ? 'Vencimiento'
                        : 'Vencimiento (opcional)'
                    }
                  />
                  <FileField resetKey={fileKey} />
                </SimpleGrid>
                <Flex justify='flex-end' mt={4}>
                  <Button
                    type='submit'
                    colorScheme='green'
                    isLoading={isLoading}
                  >
                    Subir documento
                  </Button>
                </Flex>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Flex>
  );
}

import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Link,
  SimpleGrid,
  Table,
  Text,
  Dialog,
  Portal,
  Field,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Form, Formik, FormikHelpers, useField } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import * as Yup from 'yup';
import { toaster } from '@/components/ui/toaster';
import BookingDocumentChecklist from './BookingDocumentChecklist';
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
  documentTrace,
} from '../../utils/documentStatus';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import InputFieldDayDate, {
  INVALID_DAY_DATE,
} from '../ui/form/InputFieldDayDate';
import InputFieldPlain from '../ui/form/InputFieldPlain';
import InputFieldSelector from '../ui/form/InputFieldSelector';

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const AFFECTED_QUERIES = [
  'bookingDocuments',
  'bookingDocumentStatus',
  'documentBoard',
  'exportProgress',
  'workQueue',
  'exports',
  'export',
];

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
    <Field.Root invalid={!!meta.error && meta.touched}>
      <Field.Label fontSize='sm' mb='8px'>
        Archivo (PDF, JPG o PNG, hasta 10 MB)
      </Field.Label>
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
        <Field.ErrorText mt='8px'>{meta.error}</Field.ErrorText>
      )}
    </Field.Root>
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
  const queryClient = useQueryClient();
  const { mutate: remove, isPending: isLoading } = useDeleteBookingDocument();

  const confirm = (): void =>
    remove(
      { bookingId, documentId: document.id },
      {
        onError: (error) => {
          toaster.create({
            title: 'No se eliminó el documento',
            description: serverErrorMessage(error),
            type: 'error',
            duration: 6000,
            closable: true,
          });
        },
        onSuccess: () => {
          AFFECTED_QUERIES.forEach((key) =>
            queryClient.invalidateQueries({ queryKey: [key] })
          );
          setIsOpen(false);
        },
      }
    );

  return (
    <>
      <Button
        size='xs'
        variant='ghost'
        colorPalette='red'
        onClick={() => setIsOpen(true)}
      >
        Eliminar
      </Button>
      <Dialog.Root
        open={isOpen}
        initialFocusEl={() => cancelRef.current}
        role='alertdialog'
        onOpenChange={(e) => {
          if (!e.open) {
            setIsOpen(false);
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop>
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header fontSize='lg' fontWeight='bold'>
                  Eliminar {document.typeLabel} {document.number}
                </Dialog.Header>
                <Dialog.Body>
                  Se borra el documento y su archivo. No se puede deshacer.
                </Dialog.Body>
                <Dialog.Footer>
                  <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    colorPalette='red'
                    ml={3}
                    loading={isLoading}
                    onClick={confirm}
                  >
                    Eliminar
                  </Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Backdrop>
        </Portal>
      </Dialog.Root>
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const borderColor = 'border';
  const [fileKey, setFileKey] = useState(0);
  const { data: documentsData } = useBookingDocuments(bookingId);
  const { data: typesData } = useDocumentTypes();
  const { mutate: upload, isPending: isLoading } = useUploadBookingDocument();
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
          toaster.create({
            title: 'No se subió el documento',
            description: serverErrorMessage(error),
            type: 'error',
            duration: 6000,
            closable: true,
          });
        },
        onSuccess: ({ data }) => {
          toaster.create({
            title: `${data.typeLabel} ${data.number} subido`,
            description: documentStatusText(data.status, data.daysLeft),
            type: 'success',
            duration: 4000,
            closable: true,
          });
          AFFECTED_QUERIES.forEach((key) =>
            queryClient.invalidateQueries({ queryKey: [key] })
          );
          helpers.resetForm();
          setFileKey((key) => key + 1);
        },
      }
    );

  return (
    <Flex direction='column' gap={4}>
      <Box>
        <Heading size='md'>Documentos del embarque</Heading>
        <Text fontSize='sm' color='fg.muted' mt={1}>
          BL, fitosanitario, certificado de origen, inspección de cada
          contenedor, DAE, seguro y sanitario. Valen para todas las
          exportaciones del booking. El sistema avisa por correo a la
          exportadora lo que vence en los próximos 15 días.
        </Text>
      </Box>

      <BookingDocumentChecklist bookingId={bookingId} />

      {documents.length > 0 ? (
        <Table.ScrollArea
          borderWidth='1px'
          borderColor={borderColor}
          borderRadius='md'
          whiteSpace='normal'
        >
          <Table.Root size='sm'>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Documento</Table.ColumnHeader>
                <Table.ColumnHeader>Contenedor</Table.ColumnHeader>
                <Table.ColumnHeader>Emisión</Table.ColumnHeader>
                <Table.ColumnHeader>Vencimiento</Table.ColumnHeader>
                <Table.ColumnHeader>Estado</Table.ColumnHeader>
                <Table.ColumnHeader />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {documents.map((document) => (
                <Table.Row key={document.id}>
                  <Table.Cell>
                    <Text fontWeight='semibold'>{document.typeLabel}</Text>
                    <Link
                      href={document.fileUrl}
                      color='green.fg'
                      fontSize='sm'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {document.number} · {document.fileName}
                    </Link>
                    <Text
                      fontSize='xs'
                      color='fg.muted'
                      title={document.sha256 ?? undefined}
                    >
                      {documentTrace(document)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>{document.containerNumber ?? '—'}</Table.Cell>
                  <Table.Cell>
                    {formatDayMonthYear(document.issuedAt) || '—'}
                  </Table.Cell>
                  <Table.Cell>
                    {formatDayMonthYear(document.expiresAt) || '—'}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      colorPalette={DOCUMENT_STATUS_COLOR[document.status]}
                    >
                      {documentStatusText(document.status, document.daysLeft)}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell textAlign='right'>
                    <DeleteDocumentButton
                      bookingId={bookingId}
                      document={document}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      ) : (
        <Text fontSize='sm' color='fg.muted'>
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
                borderWidth='1px'
                borderColor={borderColor}
                borderRadius='md'
                p={4}
              >
                <Text fontWeight='semibold' mb={3}>
                  Subir un documento
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                  <InputFieldSelector
                    name='type'
                    label='Tipo'
                    placeholder='Selecciona el tipo'
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
                    colorPalette='green'
                    loading={isLoading}
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

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
  Select,
  SimpleGrid,
  Table,
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
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import EmptyState from '@/components/ui/states/EmptyState';
import ErrorState from '@/components/ui/states/ErrorState';
import LoadingState from '@/components/ui/states/LoadingState';
import { useExporterUsers } from '../../hooks/exporter-user/getExporterUsers';
import {
  useChangeRole,
  useInviteUser,
  useRemoveUser,
  useResendInvitation,
} from '../../hooks/exporter-user/mutateExporterUser';
import { ExporterUser, UserRole } from '../../types/exporterUser';
import { ROLE_OPTIONS, roleLabel } from '../../utils/roles';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import InputFieldPlain from '../ui/form/InputFieldPlain';
import InputFieldSelector from '../ui/form/InputFieldSelector';
import { getNavItems, NavCounts } from '../ui/sidenav/SideNavItems';

const NO_COUNTS: NavCounts = {
  addCuttingSheet: 0,
  addSupplyShipment: 0,
  producerPendingPayments: 0,
  clientPendingPayments: 0,
  exportSentCostsPending: 0,
};

// Read from the side menu, which is the split the backend enforces on writes.
function areasOf(role: string): string {
  if (role === 'MASTER') return 'Todas las áreas, y los usuarios';
  return getNavItems(NO_COUNTS, { role })
    .map((item) => item.label)
    .join(', ');
}

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required('Requerido')
    .min(3, 'Al menos 3 caracteres')
    .max(50, 'Hasta 50 caracteres'),
  email: Yup.string().trim().email('Correo no válido').required('Requerido'),
  role: Yup.string().required('Elige un rol'),
});

export default function UsersManager(): React.JSX.Element {
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const exporterId = session?.user?.exporterId
    ? String(session.user.exporterId)
    : undefined;
  const myId = Number(session?.user?.id);
  const isMaster = session?.user?.role === 'MASTER';
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  const { data, isLoading, error, refetch } = useExporterUsers(exporterId);
  const users = (data ?? []) as ExporterUser[];
  const { mutate: invite, isLoading: isInviting } = useInviteUser();
  const { mutate: changeRole } = useChangeRole();
  const { mutate: resend, isLoading: isResending } = useResendInvitation();
  const { mutate: remove, isLoading: isRemoving } = useRemoveUser();
  const [toRemove, setToRemove] = useState<ExporterUser | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const showError = (title: string, failure: unknown): void => {
    if (isAxiosError(failure) && failure.response?.status === 401) {
      router.push('/api/auth/signout');
      return;
    }
    toast({
      title,
      description: serverErrorMessage(failure),
      status: 'error',
      duration: 6000,
      isClosable: true,
    });
  };

  const invitationToast = (email: string, sent: boolean): void => {
    toast(
      sent
        ? {
            title: 'Invitación enviada',
            description: `${email} recibirá un enlace para crear su contraseña.`,
            status: 'success',
            duration: 6000,
            isClosable: true,
          }
        : {
            title: 'El correo de invitación no salió',
            description: 'Reenvía la invitación desde la lista.',
            status: 'warning',
            duration: 8000,
            isClosable: true,
          }
    );
  };

  const refresh = (): void => {
    queryClient.invalidateQueries('exporterUsers');
  };

  if (!exporterId || isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={() => refetch()} />;

  return (
    <Flex direction='column' gap={6}>
      {isMaster && (
        <Formik
          initialValues={{ name: '', email: '', role: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) =>
            invite(
              {
                exporterId,
                body: {
                  name: values.name.trim(),
                  email: values.email.trim(),
                  role: values.role as UserRole,
                },
              },
              {
                onError: (failure) =>
                  showError('No se pudo crear el usuario', failure),
                onSuccess: ({ data: created }) => {
                  invitationToast(created.email, created.invitationSent);
                  refresh();
                  resetForm();
                },
              }
            )
          }
        >
          {({ values }) => (
            <Form>
              <Text fontWeight='semibold' mb={3}>
                Invitar a un usuario
              </Text>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <InputFieldPlain name='name' label='Nombre' />
                <InputFieldPlain name='email' label='Correo' />
                <InputFieldSelector
                  name='role'
                  label='Rol'
                  options={ROLE_OPTIONS}
                  placeholder='Elige un rol'
                />
              </SimpleGrid>
              <Text fontSize='sm' color={mutedColor} mt={2}>
                {values.role
                  ? `Trabaja en: ${areasOf(values.role)}.`
                  : 'Le llega un correo para crear su contraseña. El enlace sirve 7 días.'}
              </Text>
              <Button
                type='submit'
                colorScheme='teal'
                mt={4}
                isLoading={isInviting}
              >
                Enviar invitación
              </Button>
            </Form>
          )}
        </Formik>
      )}

      {!isMaster && (
        <Text fontSize='sm' color={mutedColor}>
          Solo el usuario principal invita usuarios y cambia sus roles.
        </Text>
      )}

      {users.length === 0 ? (
        <EmptyState title='Todavía no hay usuarios' />
      ) : (
        <Box
          overflowX='auto'
          borderWidth='1px'
          borderColor={borderColor}
          borderRadius='lg'
        >
          <Table size='sm'>
            <Thead>
              <Tr>
                <Th>Usuario</Th>
                <Th>Rol y áreas</Th>
                {isMaster && <Th />}
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => {
                const isMe = user.id === myId;
                return (
                  <Tr key={user.id}>
                    <Td>
                      <Text fontWeight='semibold'>
                        {user.name}
                        {isMe && (
                          <Badge ml={2} colorScheme='green'>
                            Tú
                          </Badge>
                        )}
                      </Text>
                      <Text fontSize='sm' color={mutedColor}>
                        {user.email}
                      </Text>
                    </Td>
                    <Td minW='190px'>
                      {isMaster && !isMe ? (
                        <Select
                          size='sm'
                          aria-label={`Rol de ${user.name}`}
                          value={user.role}
                          onChange={(event) =>
                            changeRole(
                              {
                                exporterId,
                                userId: user.id,
                                role: event.target.value as UserRole,
                              },
                              {
                                onError: (failure) =>
                                  showError(
                                    'No se pudo cambiar el rol',
                                    failure
                                  ),
                                onSuccess: ({ data: saved }) => {
                                  toast({
                                    title: `${saved.name} ahora es ${roleLabel(saved.role)}`,
                                    status: 'success',
                                    duration: 4000,
                                    isClosable: true,
                                  });
                                  refresh();
                                },
                              }
                            )
                          }
                        >
                          {ROLE_OPTIONS.map(({ id, name }) => (
                            <option key={id} value={id}>
                              {name}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        <Text>{roleLabel(user.role)}</Text>
                      )}
                      <Text fontSize='xs' color={mutedColor} mt={1}>
                        {areasOf(user.role)}
                      </Text>
                    </Td>
                    {isMaster && (
                      <Td>
                        {!isMe && (
                          <Flex gap={2} wrap='wrap' justify='flex-end'>
                            <Button
                              size='sm'
                              variant='outline'
                              colorScheme='green'
                              isDisabled={isResending}
                              onClick={() =>
                                resend(
                                  { exporterId, userId: user.id },
                                  {
                                    onError: (failure) =>
                                      showError(
                                        'No se pudo reenviar la invitación',
                                        failure
                                      ),
                                    onSuccess: ({ data: result }) =>
                                      invitationToast(
                                        user.email,
                                        result.invitationSent
                                      ),
                                  }
                                )
                              }
                            >
                              Reenviar invitación
                            </Button>
                            <Button
                              size='sm'
                              variant='ghost'
                              colorScheme='red'
                              onClick={() => setToRemove(user)}
                            >
                              Eliminar
                            </Button>
                          </Flex>
                        )}
                      </Td>
                    )}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      )}

      <AlertDialog
        isOpen={!!toRemove}
        leastDestructiveRef={cancelRef}
        onClose={() => setToRemove(null)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Eliminar usuario
            </AlertDialogHeader>
            <AlertDialogBody>
              {toRemove?.name} ya no podrá entrar. Lo que registró se conserva.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setToRemove(null)}>
                Volver
              </Button>
              <Button
                colorScheme='red'
                ml={3}
                isLoading={isRemoving}
                onClick={() => {
                  if (!toRemove) return;
                  remove(
                    { exporterId, userId: toRemove.id },
                    {
                      onError: (failure) =>
                        showError('No se pudo eliminar el usuario', failure),
                      onSuccess: () => {
                        toast({
                          title: 'Usuario eliminado',
                          status: 'success',
                          duration: 4000,
                          isClosable: true,
                        });
                        refresh();
                      },
                    }
                  );
                  setToRemove(null);
                }}
              >
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}

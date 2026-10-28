import {
  Badge,
  Box,
  Button,
  Flex,
  NativeSelect,
  SimpleGrid,
  Table,
  Text,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import { useSession } from 'next-auth/react';
import React, { useRef, useState } from 'react';
import * as Yup from 'yup';
import EmptyState from '@/components/ui/states/EmptyState';
import ErrorState from '@/components/ui/states/ErrorState';
import LoadingState from '@/components/ui/states/LoadingState';
import { toaster } from '@/components/ui/toaster';
import { qk } from '@/lib/queryKeys';
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
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const exporterId = session?.user?.exporterId
    ? String(session.user.exporterId)
    : undefined;
  const myId = Number(session?.user?.id);
  const isMaster = session?.user?.role === 'MASTER';
  const borderColor = 'border';
  const mutedColor = 'fg.muted';

  const { data, isLoading, error, refetch } = useExporterUsers(exporterId);
  const users = (data ?? []) as ExporterUser[];
  const { mutate: invite, isPending: isInviting } = useInviteUser();
  const { mutate: changeRole } = useChangeRole();
  const { mutate: resend, isPending: isResending } = useResendInvitation();
  const { mutate: remove, isPending: isRemoving } = useRemoveUser();
  const [toRemove, setToRemove] = useState<ExporterUser | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const showError = (title: string, failure: unknown): void => {
    toaster.create({
      title,
      description: serverErrorMessage(failure),
      type: 'error',
      duration: 6000,
      closable: true,
    });
  };

  const invitationToast = (email: string, sent: boolean): void => {
    toaster.create(
      sent
        ? {
            title: 'Invitación enviada',
            description: `${email} recibirá un enlace para crear su contraseña.`,
            type: 'success',
            duration: 6000,
            closable: true,
          }
        : {
            title: 'El correo de invitación no salió',
            description: 'Reenvía la invitación desde la lista.',
            type: 'warning',
            duration: 8000,
            closable: true,
          }
    );
  };

  const refresh = (): void => {
    queryClient.invalidateQueries({
      queryKey: qk('exporterUsers'),
    });
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
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
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
                colorPalette='green'
                mt={4}
                loading={isInviting}
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
          <Table.Root size='sm'>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Usuario</Table.ColumnHeader>
                <Table.ColumnHeader>Rol y áreas</Table.ColumnHeader>
                {isMaster && <Table.ColumnHeader />}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users.map((user) => {
                const isMe = user.id === myId;
                return (
                  <Table.Row key={user.id}>
                    <Table.Cell>
                      <Text fontWeight='semibold'>
                        {user.name}
                        {isMe && (
                          <Badge ml={2} colorPalette='green'>
                            Tú
                          </Badge>
                        )}
                      </Text>
                      <Text fontSize='sm' color={mutedColor}>
                        {user.email}
                      </Text>
                    </Table.Cell>
                    <Table.Cell minW='190px'>
                      {isMaster && !isMe ? (
                        <NativeSelect.Root size='sm'>
                          <NativeSelect.Field
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
                                    toaster.create({
                                      title: `${saved.name} ahora es ${roleLabel(saved.role)}`,
                                      type: 'success',
                                      duration: 4000,
                                      closable: true,
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
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                      ) : (
                        <Text>{roleLabel(user.role)}</Text>
                      )}
                      <Text fontSize='xs' color={mutedColor} mt={1}>
                        {areasOf(user.role)}
                      </Text>
                    </Table.Cell>
                    {isMaster && (
                      <Table.Cell>
                        {!isMe && (
                          <Flex gap={2} wrap='wrap' justify='flex-end'>
                            <Button
                              size='sm'
                              variant='outline'
                              colorPalette='green'
                              disabled={isResending}
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
                              colorPalette='red'
                              onClick={() => setToRemove(user)}
                            >
                              Eliminar
                            </Button>
                          </Flex>
                        )}
                      </Table.Cell>
                    )}
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </Box>
      )}

      <Dialog.Root
        open={!!toRemove}
        initialFocusEl={() => cancelRef.current}
        role='alertdialog'
        onOpenChange={(e) => {
          if (!e.open) {
            setToRemove(null);
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop>
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header fontSize='lg' fontWeight='bold'>
                  Eliminar usuario
                </Dialog.Header>
                <Dialog.Body>
                  {toRemove?.name} ya no podrá entrar. Lo que registró se
                  conserva.
                </Dialog.Body>
                <Dialog.Footer>
                  <Button ref={cancelRef} onClick={() => setToRemove(null)}>
                    Volver
                  </Button>
                  <Button
                    colorPalette='red'
                    ml={3}
                    loading={isRemoving}
                    onClick={() => {
                      if (!toRemove) return;
                      remove(
                        { exporterId, userId: toRemove.id },
                        {
                          onError: (failure) =>
                            showError(
                              'No se pudo eliminar el usuario',
                              failure
                            ),
                          onSuccess: () => {
                            toaster.create({
                              title: 'Usuario eliminado',
                              type: 'success',
                              duration: 4000,
                              closable: true,
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
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Backdrop>
        </Portal>
      </Dialog.Root>
    </Flex>
  );
}

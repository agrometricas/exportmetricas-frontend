import {
  Box,
  HStack,
  VStack,
  SimpleGrid,
  Heading,
  Text,
  Badge,
  Image,
  Separator,
} from '@chakra-ui/react';
import { getServerSession } from 'next-auth';
import { MdPerson, MdBusiness } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import { formatDayMonthYearTime } from '@/utils/dayMonthYear';
import { env } from '../../../../lib/env';
import { authOptions } from '../../../api/auth/[...nextauth]/authOptions';

const Field = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}): JSX.Element => (
  <Box>
    <Text fontSize='sm' color='fg.muted' mb={1}>
      {label}
    </Text>
    <Text fontWeight='semibold' color='fg'>
      {value}
    </Text>
  </Box>
);

const ProfilePage = async (): Promise<JSX.Element> => {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/exporter/profile`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${session?.refreshToken}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  const user = await res.json();

  const onboardingUserDone = user?.userDetails?.onboardingStatus === 'done';
  const accountActive = user?.exporterDetails?.accountStatus === 'active';

  const updatedAt = user?.exporterDetails?.updatedAt
    ? formatDayMonthYearTime(user.exporterDetails.updatedAt)
    : '—';

  const logoUrl = user?.exporterDetails?.logoUrl;

  return (
    <CardPage
      icon={<MdPerson />}
      title='Perfil de la cuenta'
      description='Detalles del usuario y de la exportadora'
    >
      {/* Usuario */}
      <Box mb={6}>
        <HStack gap={3} mb={3}>
          <Box p={2} bg='green.subtle' borderRadius='md' color='green.fg'>
            <MdPerson size={16} />
          </Box>
          <Heading size='md' color='fg'>
            Usuario
          </Heading>
          <Badge
            ml={2}
            colorPalette={onboardingUserDone ? 'green' : 'red'}
            borderRadius='full'
            px={2}
          >
            {onboardingUserDone
              ? 'Configuración completa'
              : 'Configuración pendiente'}
          </Badge>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <Field label='Nombre' value={user?.userDetails?.name ?? '—'} />
          <Field label='Correo' value={user?.userDetails?.email ?? '—'} />
        </SimpleGrid>
      </Box>

      <Separator my={4} />

      {/* Exportadora */}
      <Box>
        <HStack gap={3} mb={3}>
          <Box p={2} bg='green.subtle' borderRadius='md' color='green.fg'>
            <MdBusiness size={16} />
          </Box>
          <Heading size='md' color='fg'>
            Exportadora
          </Heading>
          <Badge
            ml={2}
            colorPalette={accountActive ? 'green' : 'red'}
            borderRadius='full'
            px={2}
          >
            {accountActive ? 'Activo' : 'Inactivo'}
          </Badge>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} mb={4}>
          <Field
            label='Nombre'
            value={user?.exporterDetails?.businessName ?? '—'}
          />
          <Field
            label='RUC/ID'
            value={user?.exporterDetails?.businessId ?? '—'}
          />
          <Field label='Correo' value={user?.exporterDetails?.email ?? '—'} />
          <Field
            label='Dirección'
            value={user?.exporterDetails?.address || 'No proporcionado'}
          />
          <Field
            label='País'
            value={user?.exporterDetails?.country?.name ?? '—'}
          />
          <Field
            label='Provincia'
            value={user?.exporterDetails?.province?.name ?? '—'}
          />
          <Field
            label='Ciudad'
            value={user?.exporterDetails?.city?.name ?? '—'}
          />
          <Field label='Última edición' value={updatedAt} />
        </SimpleGrid>

        <VStack gap={2} align='start'>
          <Text fontSize='sm' color='fg.muted'>
            Logo
          </Text>
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt='Logo de la empresa'
              boxSize='88px'
              objectFit='contain'
              borderWidth='1px'
              borderColor='border'
              borderRadius='md'
              bg='white'
              p={2}
            />
          ) : (
            <Badge colorPalette='yellow' variant='subtle' borderRadius='md'>
              Logo no disponible
            </Badge>
          )}
        </VStack>
      </Box>
    </CardPage>
  );
};

export default ProfilePage;

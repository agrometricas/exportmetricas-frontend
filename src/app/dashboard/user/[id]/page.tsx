import {
  Box,
  Card,
  CardHeader,
  CardBody,
  HStack,
  VStack,
  SimpleGrid,
  Heading,
  Text,
  Divider,
  Badge,
  Image,
} from '@chakra-ui/react';
import { getServerSession } from 'next-auth';
import { MdPerson, MdBusiness } from 'react-icons/md';
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
    <Text fontSize="sm" color="gray.500" mb={1}>
      {label}
    </Text>
    <Text fontWeight="semibold" color="gray.800">
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
    <Box minH="100vh" bg="gray.50" p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW="7xl" mx="auto">
        <Card
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          boxShadow="lg"
          overflow="hidden"
        >
          <CardHeader bg="gray.50">
            <HStack spacing={3} align="center">
              <Box p={2} bg="green.100" borderRadius="lg" color="green.600">
                <MdPerson size={20} />
              </Box>
              <Box>
                <Heading size="lg" color="gray.900" fontWeight="bold">
                  Perfil de la Cuenta
                </Heading>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  Detalles del usuario y de la exportadora
                </Text>
              </Box>
            </HStack>
          </CardHeader>

          <CardBody>
            {/* Usuario */}
            <Box mb={6}>
              <HStack spacing={3} mb={3}>
                <Box p={2} bg="green.50" borderRadius="md" color="green.700">
                  <MdPerson size={16} />
                </Box>
                <Heading size="md" color="gray.800">
                  Usuario
                </Heading>
                <Badge
                  ml={2}
                  colorScheme={onboardingUserDone ? 'green' : 'red'}
                  borderRadius="full"
                  px={2}
                >
                  {onboardingUserDone
                    ? 'Configuración completa'
                    : 'Configuración pendiente'}
                </Badge>
              </HStack>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Field label="Nombre" value={user?.userDetails?.name ?? '—'} />
                <Field label="Correo" value={user?.userDetails?.email ?? '—'} />
              </SimpleGrid>
            </Box>

            <Divider my={4} />

            {/* Exportadora */}
            <Box>
              <HStack spacing={3} mb={3}>
                <Box p={2} bg="green.50" borderRadius="md" color="green.700">
                  <MdBusiness size={16} />
                </Box>
                <Heading size="md" color="gray.800">
                  Exportadora
                </Heading>
                <Badge
                  ml={2}
                  colorScheme={accountActive ? 'green' : 'red'}
                  borderRadius="full"
                  px={2}
                >
                  {accountActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </HStack>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                <Field
                  label="Nombre"
                  value={user?.exporterDetails?.businessName ?? '—'}
                />
                <Field
                  label="RUC/ID"
                  value={user?.exporterDetails?.businessId ?? '—'}
                />
                <Field
                  label="Correo"
                  value={user?.exporterDetails?.email ?? '—'}
                />
                <Field
                  label="Dirección"
                  value={user?.exporterDetails?.address || 'No proporcionado'}
                />
                <Field
                  label="País"
                  value={user?.exporterDetails?.country?.name ?? '—'}
                />
                <Field
                  label="Provincia"
                  value={user?.exporterDetails?.province?.name ?? '—'}
                />
                <Field
                  label="Ciudad"
                  value={user?.exporterDetails?.city?.name ?? '—'}
                />
                <Field label="Última edición" value={updatedAt} />
              </SimpleGrid>

              <VStack spacing={2} align="start">
                <Text fontSize="sm" color="gray.500">
                  Logo
                </Text>
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt="Logo de la Empresa"
                    boxSize="88px"
                    objectFit="contain"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    bg="white"
                    p={2}
                  />
                ) : (
                  <Badge colorScheme="yellow" variant="subtle" borderRadius="md">
                    Logo no disponible
                  </Badge>
                )}
              </VStack>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
};

export default ProfilePage;

'use client';

import {
  Box,
  Center,
  Grid,
  GridItem,
  Heading,
  Text,
  useColorModeValue,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import CalendarSummaryContainer from './CalendarSummaryContainer';
import ContractUsageAlerts from '../contract-usage/ContractUsageAlerts';

const Dashboard = (): JSX.Element => {
  const { data: session, status } = useSession();

  const pageBg = useColorModeValue('transparent', 'transparent');
  const cardBg = useColorModeValue('white', 'gray.800');
  const headingColor = useColorModeValue('gray.900', 'gray.100');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (status === 'loading') {
    return (
      <Center minH="60vh">
        <Text>Cargando...</Text>
      </Center>
    );
  }

  const role = session?.user?.role;

  return (
    <Box
      bg={pageBg}
      maxW="8xl"
      mx="auto"
      px={{ base: 4, md: 6, lg: 8 }}
      py={{ base: 6, md: 8 }}
    >
      <Heading
        as="h1"
        size="lg"
        color={headingColor}
        fontWeight="bold"
        mb={4}
      >
        Bienvenido {session?.user?.name}
      </Heading>

      {(role === 'MASTER' || role === 'LOGISTICS' || role === 'EXPORT') && (
        <Box mb={6}>
          <ContractUsageAlerts />
        </Box>
      )}

      {role === 'MASTER' && (
        <Box mb={6}>
          <CalendarSummaryContainer />
        </Box>
      )}

      <Grid
        templateColumns={{ base: '1fr', md: '3fr 1fr' }}
        gap={{ base: 4, md: 6 }}
      >
        <GridItem>
          {role === 'LOGISTICS' && (
            <Card
              bg={cardBg}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="xl"
              boxShadow="md"
            >
              <CardBody>
                <Text color={textColor}>Componente para Logística</Text>
              </CardBody>
            </Card>
          )}

          {role === 'EXPORT' && (
            <Card
              bg={cardBg}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="xl"
              boxShadow="md"
            >
              <CardBody>
                <Text color={textColor}>Componente para Exportación</Text>
              </CardBody>
            </Card>
          )}

          {role !== 'MASTER' && role !== 'LOGISTICS' && role !== 'EXPORT' && (
            <Text color={textColor}>No tienes acceso a contenido del dashboard.</Text>
          )}
        </GridItem>

        <GridItem>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Dashboard;

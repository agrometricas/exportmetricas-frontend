'use client';
import { Box, Heading } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import LoadingState from '@/components/ui/states/LoadingState';
import CalendarSummaryContainer from './CalendarSummaryContainer';
import WorkQueuePanel from './WorkQueuePanel';
import ContractUsageAlerts from '../contract-usage/ContractUsageAlerts';
import { useColorModeValue } from '../ui/color-mode';

const Dashboard = (): JSX.Element => {
  const { data: session, status } = useSession();

  const pageBg = useColorModeValue('transparent', 'transparent');
  const headingColor = 'fg.heading';

  if (status === 'loading') {
    return <LoadingState minH='60vh' />;
  }

  const role = session?.user?.role;

  return (
    <Box
      bg={pageBg}
      maxW='8xl'
      mx='auto'
      px={{ base: 4, md: 6, lg: 8 }}
      py={{ base: 6, md: 8 }}
    >
      <Heading as='h1' size='lg' color={headingColor} fontWeight='bold' mb={4}>
        Bienvenido {session?.user?.name}
      </Heading>

      <Box mb={6}>
        <WorkQueuePanel role={role} />
      </Box>

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
    </Box>
  );
};

export default Dashboard;

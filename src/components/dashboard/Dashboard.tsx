'use client';
import { Box, Stack, Text } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import LoadingState from '@/components/ui/states/LoadingState';
import CalendarSummaryContainer from './CalendarSummaryContainer';
import WorkQueuePanel from './WorkQueuePanel';
import ContractUsageAlerts from '../contract-usage/ContractUsageAlerts';

const Dashboard = (): JSX.Element => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <LoadingState minH='60vh' />;
  }

  const role = session?.user?.role;

  return (
    <PageLayout
      icon={MdOutlineSpaceDashboard}
      title={`Bienvenido, ${session?.user?.name ?? ''}`}
      description='Lo que falta en tu área, paso por paso'
    >
      <Stack gap={8}>
        <WorkQueuePanel role={role} />

        {(role === 'MASTER' || role === 'LOGISTICS' || role === 'EXPORT') && (
          <ContractUsageAlerts />
        )}

        {role === 'MASTER' && (
          <Box as='section'>
            <Text as='h2' textStyle='h2' color='fg.heading' mb={4}>
              Exportaciones de la semana
            </Text>
            <CalendarSummaryContainer />
          </Box>
        )}
      </Stack>
    </PageLayout>
  );
};

export default Dashboard;

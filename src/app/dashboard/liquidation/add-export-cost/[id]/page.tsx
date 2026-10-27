'use client';
import { Box, Card, Heading, HStack, Icon, Text, Separator } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { redirect, useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useLayoutEffect } from 'react';
import { FiDollarSign } from 'react-icons/fi';
import LoadingState from '@/components/ui/states/LoadingState';
import ExportSentCostForm from '../../../../../components/export-cost/ExportSentCostForm';
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { useExportSent } from '../../../../../hooks/export/export-sent/getExportSent';
import { ExportSentType } from '../../../../../types/exportSent';

function ExportSentCostPage(): React.JSX.Element {
  const params = useParams<{ id: string }>();
  const { data, isLoading, error } = useExportSent({
    exportSentId: params.id,
  });
  const pendingProducerCost = data as Partial<ExportSentType>;
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (error && (error as AxiosError).isAxiosError) {
      const { response } = error as AxiosError<{ statusCode: number }>;
      const statusCode = response?.data?.statusCode;
      if (statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
  }, [error, router]);

  useLayoutEffect(() => {
    if (!isLoading) {
      if (!pendingProducerCost) {
        return redirect(pathname.replace(/\/\d+$/, ''));
      }
    }
  }, [isLoading, pendingProducerCost, pathname]);

  const bgColor = 'bg.canvas';
  const cardBg = 'bg.panel';
  const borderColor = 'border';
  const headingColor = 'fg.heading';
  const textColor = 'fg';
  const grayColor = 'green.subtle';

  if (isLoading) {
    return (
      <LoadingState minH='60vh' />
    );
  }

  return (
    <Box minH="100vh" bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW="8xl" mx="auto">
        <Card.Root
          bg={cardBg}
          borderWidth='1px'
          borderColor={borderColor}
          borderRadius="xl"
          boxShadow='sm'
          overflow="hidden"
          borderTopWidth="4px"
          borderTopColor="green.500"
        >
          <Card.Header bg={grayColor} pb={4}>
            <HStack gap={3} align="center">
              <Box p={2} bg="green.subtle" borderRadius="lg" color="green.fg">
                <Icon boxSize={5} asChild><FiDollarSign /></Icon>
              </Box>
              <Box>
                <Heading size="lg" color={headingColor} fontWeight="bold">
                  Validación de Costos
                </Heading>
                <Text fontSize="sm" color={textColor} mt={1}>
                  Revisa y confirma los costos asociados al envío seleccionado
                </Text>
              </Box>
            </HStack>
          </Card.Header>

          <Separator />

          <Card.Body>
            <ExportSentCostForm pathname={pathname} />
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(ExportSentCostPage);

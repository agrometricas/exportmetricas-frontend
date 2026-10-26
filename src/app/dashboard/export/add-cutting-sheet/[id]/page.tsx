'use client';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Icon,
  Text,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { redirect, useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useLayoutEffect } from 'react';
import { MdContentCut } from 'react-icons/md';
import LoadingState from '@/components/ui/states/LoadingState';
import CuttingSheetForm from '../../../../../components/export/cutting-sheet/CuttingSheetForm';
import { useExportSent } from '../../../../../hooks/export/export-sent/getExportSent';
import { useExport } from '../../../../../hooks/export/getExport';
import { ExportResponse } from '../../../../../types/export.response';
import { ExportSentType } from '../../../../../types/exportSent';

const CuttingSheetPage = (): React.JSX.Element => {
  const params = useParams<{ id: string }>();
  const { data, isLoading, error } = useExport({ exportId: params.id });
  const {
    data: exportSentData,
    isLoading: isLoadingSent,
  } = useExportSent({
    exportSentId: data?.exportSent?.id?.toString() ?? '',
  });

  const pendingCuttingSheet = data as Partial<ExportResponse>;
  const exportSent = exportSentData as Partial<ExportSentType>;
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (error && (error as AxiosError).isAxiosError) {
      const { response } = error as AxiosError<{
        statusCode: number;
      }>;

      const statusCode = response?.data?.statusCode;

      if (statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
  }, [error, router]);

  useLayoutEffect(() => {
    if (!isLoading && !isLoadingSent) {
      if (!pendingCuttingSheet) {
        return redirect(pathname.replace(/\/\d+$/, ''));
      }
    }
  }, [isLoading, isLoadingSent, pendingCuttingSheet, pathname]);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.900', 'gray.100');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const grayColor = useColorModeValue('green.50', 'green.750');

  if (isLoading || isLoadingSent) {
    return (
      <LoadingState minH='60vh' />
    );
  }

  return (
    <Box minH="100vh" bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW="8xl" mx="auto">
        <Card
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="xl"
          boxShadow="lg"
          overflow="hidden"
          borderTopWidth="4px"
          borderTopColor="green.500"
        >
          <CardHeader bg={grayColor} pb={4}>
            <HStack spacing={3} align="center">
              <Box p={2} bg="green.100" borderRadius="lg" color="green.600">
                <Icon as={MdContentCut} boxSize={5} />
              </Box>
              <Box>
                <Heading size="lg" color={headingColor} fontWeight="bold">
                  Hoja de Corte
                </Heading>
                <Text fontSize="sm" color={textColor} mt={1}>
                  Completa y envía la hoja de corte del envío seleccionado
                </Text>
              </Box>
            </HStack>
          </CardHeader>

          <Divider />

          <CardBody>
            <CuttingSheetForm
              cuttingSheetSelected={pendingCuttingSheet}
              exportSentSelected={exportSent}
            />
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
};

export default CuttingSheetPage;

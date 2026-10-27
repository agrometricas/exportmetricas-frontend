'use client';
import { Box, Card, Heading, HStack, Icon, Text, Separator } from '@chakra-ui/react';
import React from 'react';
import { MdContentCut } from 'react-icons/md';
import PendingCuttingSheetList from '../../../../components/export/cutting-sheet/PendingCuttingSheetList';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

const CuttingSheetsPage = (): React.JSX.Element => {
  const bgColor = 'bg.canvas';
  const cardBg = 'bg.panel';
  const borderColor = 'border';
  const headingColor = 'fg.heading';
  const textColor = 'fg';

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
          <Card.Header bg={'bg.subtle'} pb={4}>
            <HStack gap={3} align="center">
              <Box p={2} bg="green.subtle" borderRadius="lg" color="green.fg">
                <Icon boxSize={5} asChild><MdContentCut /></Icon>
              </Box>
              <Box>
                <Heading size="lg" color={headingColor} fontWeight="bold">
                  Hojas de Corte
                </Heading>
                <Text fontSize="sm" color={textColor} mt={1}>
                  Revisa y gestiona las hojas de corte pendientes
                </Text>
              </Box>
            </HStack>
          </Card.Header>

          <Separator />

          <Card.Body>
            <PendingCuttingSheetList />
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
};

export default IsOnboarding(CuttingSheetsPage);

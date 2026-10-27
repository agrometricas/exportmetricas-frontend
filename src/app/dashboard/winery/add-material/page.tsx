'use client';
import { Box, Card, HStack, Heading, Icon, Text, Flex, Separator } from '@chakra-ui/react';
import { Formik } from 'formik';
import React from 'react';
import { MdInventory2 } from 'react-icons/md';
import IsOnboarding from '../../../../components/ui/IsOnboarding';
import ImportExporterStockDrawer from '../../../../components/winery/ImportExporterStockDrawer';
import { MaterialList } from '../../../../components/winery/MaterialList';

function AddMaterialPage(): React.JSX.Element {
  const bgColor = 'bg.canvas';
  const cardBg = 'bg.panel';
  const borderColor = 'border';
  const headingColor = 'fg.heading';
  const textColor = 'fg';
  const headBg = 'bg.subtle';

  return (
    <Formik
      initialValues={{ 'import-exporter-stock': null }}
      onSubmit={() => undefined}
    >
      {() => (
        <Box minH="100vh" w="100%" bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
          <Box maxW="8xl" mx="auto">
            <Card.Root
              bg={cardBg}
              borderColor={borderColor}
              borderRadius="xl"
              boxShadow='sm'
              overflow="hidden"
              borderWidth='1px'
              borderTopWidth="4px"
              borderTopColor="green.500"
            >
              <Card.Header bg={headBg} pb={4}>
                <Flex
                  align="center"
                  justify="space-between"
                  wrap="wrap"
                  gap={3}
                >
                  <HStack gap={3} align="center">
                    <Box p={2} bg="green.subtle" borderRadius="lg" color="green.fg">
                      <Icon boxSize={5} asChild><MdInventory2 /></Icon>
                    </Box>
                    <Box>
                      <Heading size="lg" color={headingColor} fontWeight="bold">
                        Agregar Stock de Materiales
                      </Heading>
                      <Text fontSize="sm" color={textColor} mt={1}>
                        Completa la carga manual o importa desde archivo
                      </Text>
                    </Box>
                  </HStack>

                  <ImportExporterStockDrawer />
                </Flex>
              </Card.Header>

              <Separator />

              <Card.Body>
                <MaterialList />
              </Card.Body>
            </Card.Root>
          </Box>
        </Box>
      )}
    </Formik>
  );
}

export default IsOnboarding(AddMaterialPage);

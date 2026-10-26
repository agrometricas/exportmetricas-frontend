'use client';

import {
  Box,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Heading,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import { MdImage } from 'react-icons/md';
import BoxBrandLogoForm from '../../../components/box-brands/UploadLogoForm';
import ProducerLogoForm from '../../../components/producer/UploadLogoForm';
import ExporterLogoForm from '../../../components/settings/upload-logo/UploadLogoForm';
import IsOnboarding from '../../../components/ui/IsOnboarding';
import { LOGO_TABS, logoTabIndex } from '../../../utils/logoTabs';

const LOGO_FORMS = {
  exportadora: ExporterLogoForm,
  productores: ProducerLogoForm,
  alicuotas: BoxBrandLogoForm,
};

function LogoTabs(): React.JSX.Element {
  const searchParams = useSearchParams();
  return (
    <Tabs
      colorScheme='green'
      isLazy
      defaultIndex={logoTabIndex(searchParams.get('tab'))}
    >
      <TabList>
        {LOGO_TABS.map(({ key, label }) => (
          <Tab key={key}>{label}</Tab>
        ))}
      </TabList>
      <TabPanels>
        {LOGO_TABS.map(({ key }) => {
          const LogoForm = LOGO_FORMS[key];
          return (
            <TabPanel key={key} px={0}>
              <LogoForm />
            </TabPanel>
          );
        })}
      </TabPanels>
    </Tabs>
  );
}

function LogosPage(): React.JSX.Element {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headBg = useColorModeValue('gray.50', 'gray.750');
  const headingColor = useColorModeValue('gray.900', 'gray.100');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box minH='100vh' bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW='7xl' mx='auto'>
        <Card
          bg={cardBg}
          borderColor={borderColor}
          borderRadius='xl'
          boxShadow='lg'
          overflow='hidden'
          border='1px solid'
        >
          <CardHeader bg={headBg}>
            <HStack spacing={3} align='center'>
              <Box p={2} bg='green.100' borderRadius='lg' color='green.600'>
                <Icon as={MdImage} boxSize={5} />
              </Box>
              <Box>
                <Heading size='lg' color={headingColor} fontWeight='bold'>
                  Logos
                </Heading>
                <Text fontSize='sm' color={textColor} mt={1}>
                  Sube o cambia el logo de la exportadora, de un productor o de
                  una alícuota.
                </Text>
              </Box>
            </HStack>
          </CardHeader>

          <CardBody>
            {/* useSearchParams needs a Suspense boundary to build. */}
            <Suspense fallback={null}>
              <LogoTabs />
            </Suspense>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
}

export default IsOnboarding(LogosPage);

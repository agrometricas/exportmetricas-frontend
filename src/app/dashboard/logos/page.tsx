'use client';
import { Box, Card, HStack, Heading, Icon, Tabs, Text } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import { MdImage } from 'react-icons/md';
import BoxBrandLogoForm from '../../../components/box-brands/UploadLogoForm';
import ProducerLogoForm from '../../../components/producer/UploadLogoForm';
import ExporterLogoForm from '../../../components/settings/upload-logo/UploadLogoForm';
import { useColorModeValue } from '../../../components/ui/color-mode';
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
    <Tabs.Root
      colorPalette='green'
      lazyMount
      defaultValue={LOGO_TABS[logoTabIndex(searchParams.get('tab'))].key}
    >
      <Tabs.List>
        {LOGO_TABS.map(({ key, label }) => (
          <Tabs.Trigger key={key} value={key}>
            {label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {LOGO_TABS.map(({ key }) => {
        const LogoForm = LOGO_FORMS[key];
        return (
          <Tabs.Content key={key} value={key} px={0}>
            <LogoForm />
          </Tabs.Content>
        );
      })}
    </Tabs.Root>
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
        <Card.Root
          bg={cardBg}
          borderColor={borderColor}
          borderRadius='xl'
          boxShadow='lg'
          overflow='hidden'
          border='1px solid'
        >
          <Card.Header bg={headBg}>
            <HStack gap={3} align='center'>
              <Box p={2} bg='green.100' borderRadius='lg' color='green.600'>
                <Icon boxSize={5} asChild>
                  <MdImage />
                </Icon>
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
          </Card.Header>

          <Card.Body>
            {/* useSearchParams needs a Suspense boundary to build. */}
            <Suspense fallback={null}>
              <LogoTabs />
            </Suspense>
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(LogosPage);

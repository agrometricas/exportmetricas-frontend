'use client';
import { Tabs } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import { MdImage } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
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
  return (
    <CardPage
      icon={MdImage}
      title='Logos'
      description='Sube o cambia el logo de la exportadora, de un productor o de una alícuota.'
    >
      {/* useSearchParams needs a Suspense boundary to build. */}
      <Suspense fallback={null}>
        <LogoTabs />
      </Suspense>
    </CardPage>
  );
}

export default IsOnboarding(LogosPage);

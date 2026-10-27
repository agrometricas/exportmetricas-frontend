'use client';
import { Card } from '@chakra-ui/react';
import React from 'react';
import { MdLocalShipping } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import TransportRatesManager from '../../../../components/transport-rate/TransportRatesManager';
import IsOnboarding from '../../../../components/ui/IsOnboarding';
import SectionTabs from '../../../../components/ui/SectionTabs';
import { LOGISTICS_TABS } from '../../../../components/ui/sidenav/navMenus';

function TransportRatesPage(): React.JSX.Element {
  return (
    <PageLayout
      icon={MdLocalShipping}
      title='Tarifas de transporte'
      description='Costo por contenedor de cada transportista según la provincia de la finca'
      tabs={<SectionTabs tabs={LOGISTICS_TABS} />}
    >
      <Card.Root boxShadow='sm'>
        <Card.Body>
          <TransportRatesManager />
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(TransportRatesPage);

'use client';
import { Text } from '@chakra-ui/react';
import React from 'react';
import { MdLocationOn } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import LoadingState from '@/components/ui/states/LoadingState';
import UpdateExporterForm from '../../../../../components/settings/UpdateExporterForm';
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { useExporter, UserProfile } from '../../../../../hooks/useUserProfile';

const UpdateExporterPage = (): React.JSX.Element => {
  const { user, isLoading } = useExporter();
  const exporter = user as Partial<UserProfile>;
  const textColor = 'fg';

  if (isLoading) {
    return <LoadingState minH='60vh' />;
  }

  return (
    <CardPage
      icon={MdLocationOn}
      title='Modificar ubicación'
      description='Actualiza la información de ubicación y detalles de la exportadora.'
    >
      {exporter?.exporterDetails ? (
        <UpdateExporterForm exporterDetails={exporter.exporterDetails} />
      ) : (
        <Text color={textColor}>
          No se encontraron detalles de la exportadora.
        </Text>
      )}
    </CardPage>
  );
};

export default IsOnboarding(UpdateExporterPage);
